<!--
  (c) 2020 Open AR Cloud, This code is licensed under MIT license (see LICENSE.md for details)
  (c) 2024 Nokia, Licensed under the MIT License, SPDX-License-Identifier: MIT
-->

<script lang="ts">
    import L from 'leaflet';
    import * as h3 from 'h3-js';
    import geojson2h3 from 'geojson2h3';

    import { geoPose, H3RESOLUTION_AUTO, DEFAULT_H3RESOLUTION } from '../core/store';

    import MapControl from './MapControl.svelte';

    export let onSaveCancel: () => void;
    export let updateGeopose: ({ lat, lon }: { lat: number; lon: number }) => void;
    const COUNT_H3RING = 1;

    const DEFAULT_ZOOM = 13;

    const COLOR_H3Center = '#ff7800';
    const COLOR_H3RING = '#e5b70b';
    const OPACITY_H3HEXAGON = 0.4;

    let map: L.Map | null;

    // Royal Observatory, Greenwich (51°28′40″N 0°00′05″W)
    let thisLat = 51.477778;
    let thisLon = -0.001389;

    let thisH3Index: h3.H3IndexInput;
    let currentH3Resolution = $DEFAULT_H3RESOLUTION;

    function createMap(container: HTMLElement) {
        let calcH3Resolution = () => (currentH3Resolution === $H3RESOLUTION_AUTO ? Math.round(0.7 * (m.getZoom() - 3)) : currentH3Resolution);

        let streetLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: `&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>`,
            maxZoom: 19,
        });

        let satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: `&copy; <a href="http://www.esri.com/">Esri</a>,
                 i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community`,
            maxZoom: 18,
        });

        let m = L.map(container, {
            center: [thisLat, thisLon],
            zoom: DEFAULT_ZOOM,
            maxZoom: 19,
            layers: [streetLayer],
        });

        const baseMaps = {
            Street: streetLayer,
            Satellite: satelliteLayer,
        };

        let h3MarkerLayer = L.layerGroup();
        h3MarkerLayer.addTo(m);

        let h3Layer = L.geoJSON([], {
            style: (feature) => {
                return {
                    color: feature?.id === thisH3Index ? COLOR_H3Center : COLOR_H3RING,
                    opacity: OPACITY_H3HEXAGON,
                };
            },
            onEachFeature: (feature, layer) => {
                if (feature.id !== thisH3Index) {
                    layer.on({
                        click: (event) => {
                            updateH3Layers(event.target.feature.id, h3Layer);
                        },
                    });
                }
            },
        });

        let centerId = h3.geoToH3(thisLat, thisLon, calcH3Resolution());
        updateH3Layers(centerId, h3Layer);

        h3Layer.addTo(m);
        h3Layer.bringToFront();

        let marker = L.circleMarker([thisLat, thisLon], {
            radius: 8,
            color: '#ff7800',
            fillColor: '#ffffff',
            fillOpacity: 1,
            weight: 2,
        }).addTo(m);

        m.on('click', (event) => {
            updateMarker(marker, event.latlng, calcH3Resolution(), toolbarComponent);

            h3Layer.clearLayers();
            const clickH3 = h3.geoToH3(event.latlng.lat, event.latlng.lng, calcH3Resolution());
            updateH3Layers(clickH3, h3Layer);
        });

        m.on('zoomend', () => {
            let tempResolution = currentH3Resolution === $H3RESOLUTION_AUTO ? calcH3Resolution() : currentH3Resolution;
            toolbarComponent?.$set({ h3Resolution: tempResolution });

            // TODO: Find a better way to change the resolution of an H3 index
            const centerGeo = marker ? Object.values(marker.getLatLng()) : h3.h3ToGeo(thisH3Index);
            const centerId = h3.geoToH3(centerGeo[0], centerGeo[1], tempResolution);
            updateH3Layers(centerId, h3Layer);

            updateMarker(marker, marker ? marker.getLatLng() : { lat: centerGeo[0], lng: centerGeo[1] }, calcH3Resolution(), toolbarComponent);
        });

        const toolbar = new L.Control({ position: 'topright' });
        let toolbarComponent: MapControl | null;

        toolbar.onAdd = () => {
            let div = L.DomUtil.create('div');
            toolbarComponent = new MapControl({
                target: div,
                props: {
                    onSaveCancel,
                    updateGeopose,
                    lat: thisLat,
                    lon: thisLon,
                    h3: thisH3Index,
                },
            });

            toolbarComponent.$on('change-h3resolution', (event) => {
                let previousResolution = currentH3Resolution;
                currentH3Resolution = event.detail;

                if (previousResolution !== $H3RESOLUTION_AUTO && event.detail !== $H3RESOLUTION_AUTO && previousResolution !== event.detail) {
                    const centerGeo = marker ? Object.values(marker.getLatLng()) : h3.h3ToGeo(thisH3Index);
                    const centerId = h3.geoToH3(centerGeo[0], centerGeo[1], calcH3Resolution());
                    updateH3Layers(centerId, h3Layer);

                    updateMarker(marker, { lat: centerGeo[0], lng: centerGeo[1] }, calcH3Resolution(), toolbarComponent);
                }
            });
            toolbarComponent.$on('change-display', (event) => {
                m.removeLayer(baseMaps[event.detail.remove]);
                m.addLayer(baseMaps[event.detail.add]);
            });
            toolbarComponent.$on('movemarker', (event) => {
                m.panTo([event.detail.lat, event.detail.lon]);
                marker.setLatLng([event.detail.lat, event.detail.lon]);

                h3Layer.clearLayers();
                const clickH3 = h3.geoToH3(event.detail.lat, event.detail.lon, calcH3Resolution());
                updateH3Layers(clickH3, h3Layer);
            });
            return div;
        };

        toolbar.onRemove = () => {
            if (toolbarComponent) {
                toolbarComponent.$destroy();
                toolbarComponent = null;
            }
        };

        toolbar.addTo(m);

        return m;
    }

    function updateMarker(marker: L.CircleMarker, latlng: { lat: number; lng: number }, h3Resolution: number, toolbarComponent: MapControl | null) {
        if (marker) {
            marker.setLatLng(latlng);

            toolbarComponent?.$set({
                lat: latlng.lat,
                lon: latlng.lng,
                h3: h3.geoToH3(latlng.lat, latlng.lng, h3Resolution),
            });
        }
    }

    function updateH3Layers(centerId: string, gridLayer: L.GeoJSON) {
        const features = getFeaturesForH3Index(centerId);

        gridLayer.clearLayers();
        gridLayer.addData(features);
    }

    function getFeaturesForH3Index(newIndex: h3.H3IndexInput) {
        thisH3Index = newIndex;
        const kRing = h3.kRing(thisH3Index, COUNT_H3RING);
        return geojson2h3.h3SetToFeatureCollection(kRing);
    }

    function instantiateMap(container: HTMLElement) {
        // Leaflet doesn't find it's own icons...
        L.Icon.Default.imagePath = '/leaflet/';

        map = createMap(container);
        requestAnimationFrame(() => map?.invalidateSize());
        return {
            destroy: () => {
                map?.remove();
                map = null;
            },
        };
    }

    function mapAction(container: HTMLElement) {
        if ($geoPose?.position?.lat && $geoPose.position.lat !== 0 && $geoPose.position?.lon && $geoPose.position.lon !== 0) {
            thisLat = $geoPose.position.lat;
            thisLon = $geoPose.position.lon;
        }

        return instantiateMap(container);
    }

    function resizeMap() {
        if (map) {
            map.invalidateSize();
        }
    }
</script>

<div id="map" use:mapAction><slot /></div>

<svelte:window on:resize={resizeMap} />

<svelte:head>
    <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
        integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
        crossorigin=""
    />
</svelte:head>

<style>
    #map {
        height: 100%;
        width: 100%;
    }

    /* The create form gives every div inside a fieldset a 20px margin.
       Leaflet panes are those divs, so the pin was drawn 40px from the click. */
    #map :global(.leaflet-pane),
    #map :global(.leaflet-control),
    #map :global(.leaflet-top),
    #map :global(.leaflet-bottom),
    #map :global(.leaflet-control-container) {
        margin: 0;
    }

    #map :global(.h3indexmarkercontainer) {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: fit-content !important;
    }

    #map :global(.h3indexmarker) {
        padding: 7px;
        overflow-x: hidden;
        border-radius: 0.5rem;
        font-weight: 700;
        text-overflow: ellipsis;
        background-color: #ffffff60;
    }
</style>
