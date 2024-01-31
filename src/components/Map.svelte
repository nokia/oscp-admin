<!--
  (c) 2020 Open AR Cloud, This code is licensed under MIT license (see LICENSE.md for details)
  (c) 2024 Nokia, Licensed under the MIT License, SPDX-License-Identifier: MIT
-->

<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    import L from 'leaflet';
    import * as h3 from 'h3-js';
    import geojson2h3 from 'geojson2h3';

    import { geoPose, H3RESOLUTION_AUTO, DEFAULT_H3RESOLUTION } from '../core/store';

    import MapControl from './MapControl.svelte';

    export let onSaveCancel: () => void;
    export let updateGeopose: ({ lat, lon }: { lat: number; lon: number }) => void;
    const COUNT_H3RING = 1;

    const DEFAULT_ZOOM = 13;
    const MAX_ZOOM = 30;

    const COLOR_H3Center = '#ff7800';
    const COLOR_H3RING = '#e5b70b';
    const OPACITY_H3HEXAGON = 0.4;

    const COLOR_GEOPOSECOVERAGE = '#78ff00';
    const COLOR_GEOPOSECOVERAGESELECTED = '#ff7800';
    const OPACITY_GEOPOSECOVERAGE = 0.4;

    const dispatch = createEventDispatcher<{
        'goto-checkcontent': {
            lat: number;
            lon: number;
            h3: h3.H3IndexInput;
        };
    }>();

    let map: L.Map | null;

    // LatLon defaults to Heidelberg Castle
    let thisLat = 49.410625;
    let thisLon = 8.715277;

    let thisH3Index: h3.H3IndexInput;
    let currentH3Resolution = $DEFAULT_H3RESOLUTION;

    let thisGeoposeId: string;

    let fakeServices = [
        {
            id: '12345',
            type: 'ssr',
            services: [
                {
                    id: 'mv1',
                    type: 'geopose',
                    url: 'http://geopose.geo1.example.com/neubulach',
                    title: 'Neubulach area',
                    description: "Find out where you are and in which direction you're looking",
                    capabilities: ['geopose', 'outside'],
                },
            ],
            geometry: {
                type: 'Polygon',
                coordinates: [
                    [
                        [8.69997024536, 48.65729395205282],
                        [8.71387481689, 48.68824070611107],
                        [8.66769790649, 48.716337032605665],
                        [8.60006332397, 48.67702045350972],
                        [8.64126205444, 48.65718055903762],
                        [8.69997024536, 48.65729395205282],
                    ],
                ],
            },
            altitude: 0,
        },
        {
            id: '54321',
            type: 'ssr',
            services: [
                {
                    id: 'mv1',
                    type: 'geopose',
                    url: 'http://geopose.geo1.example.com/calw',
                    title: 'Calw area',
                    description: "Find out where you are and in which direction you're looking",
                    capabilities: ['geopose', 'outside'],
                },
            ],
            geometry: {
                type: 'Polygon',
                coordinates: [
                    [
                        [8.67610931396, 48.663756932307564],
                        [8.74185562134, 48.618044744593455],
                        [8.84056091309, 48.653665249055535],
                        [8.7384223938, 48.72018772585415],
                        [8.67610931396, 48.663756932307564],
                    ],
                ],
            },
            altitude: 0,
        },
    ];

    function createMap(container: HTMLElement) {
        let calcH3Resolution = () => (currentH3Resolution === $H3RESOLUTION_AUTO ? Math.round(0.7 * (m.getZoom() - 3)) : currentH3Resolution);

        let streetLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: `&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>,
                                &copy; <a href="https://carto.com/attributions" target="_blank">CARTO</a>`,
            subdomains: 'abcd',
            maxZoom: MAX_ZOOM,
        });

        let satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: `&copy; <a href="http://www.esri.com/">Esri</a>,
                 i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community`,
            maxZoom: 18,
        });

        let m = L.map(container, {
            center: [thisLat, thisLon],
            zoom: DEFAULT_ZOOM,
            layers: [streetLayer, satelliteLayer],
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

        let marker = L.marker([thisLat, thisLon], { draggable: true }).addTo(m);
        marker.on('dragend', () => {
            const latlng = marker.getLatLng();
            updateMarker(marker, latlng, calcH3Resolution(), toolbarComponent);

            h3Layer.clearLayers();
            const clickH3 = h3.geoToH3(latlng.lat, latlng.lng, calcH3Resolution());
            updateH3Layers(clickH3, h3Layer);
        });

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

        const coverageLayer = L.geoJSON([], {
            style: (feature) => {
                return {
                    fillColor: COLOR_GEOPOSECOVERAGE,
                    color: feature?.properties.recordId === thisGeoposeId ? COLOR_GEOPOSECOVERAGESELECTED : COLOR_GEOPOSECOVERAGE,
                    opacity: OPACITY_GEOPOSECOVERAGE,
                };
            },
            onEachFeature: (feature, layer) => {
                layer.on({
                    click: (event) => {
                        updateGeoposeCoverageLayers(event.target.feature.id, coverageLayer);
                    },
                });
            },
        });

        coverageLayer.addTo(m);
        coverageLayer.bringToBack();

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
            toolbarComponent.$on('check-geoposeservices', () => {
                // TODO: Simple fake for now, as no GeoPose services are available, yet

                // Request services from service discovery
                toolbarComponent?.$set({
                    geoPoseServices: fakeServices,
                });

                // Display the service coverage polygons on the map
                let geoJsonFeatures = coverageFeatureCollectionFromSsrs(fakeServices);

                coverageLayer.clearLayers();
                coverageLayer.addData(geoJsonFeatures);
            });
            toolbarComponent.$on('movemarker', (event) => {
                m.panTo([event.detail.lat, event.detail.lon]);
                marker.setLatLng([event.detail.lat, event.detail.lon]);

                h3Layer.clearLayers();
                const clickH3 = h3.geoToH3(event.detail.lat, event.detail.lon, calcH3Resolution());
                updateH3Layers(clickH3, h3Layer);
            });
            toolbarComponent.$on('select-geoposeservice', (event) => updateGeoposeCoverageLayers(event.detail, coverageLayer));

            toolbarComponent.$on('checkcontent', (event) => dispatch('goto-checkcontent', event.detail));

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

    function coverageFeatureCollectionFromSsrs(scrs: typeof fakeServices) {
        const features = scrs.reduce(
            (geoJsonFeatures, record) => {
                if (record.services.some((service) => service.type === 'geopose')) {
                    geoJsonFeatures.push({
                        type: 'Feature',
                        properties: {
                            recordId: record.id,
                        },
                        geometry: record.geometry,
                    });
                }
                return geoJsonFeatures;
            },
            [] as {
                type: 'Feature';
                properties: {
                    recordId: any;
                };
                geometry: {
                    type: string;
                    coordinates: number[][][];
                };
            }[],
        );

        return {
            type: 'FeatureCollection',
            features: features,
        } as const;
    }

    function updateGeoposeCoverageLayers(featureId: string, coverageLayer: L.GeoJSON) {
        thisGeoposeId = featureId;
        coverageLayer.resetStyle();
    }

    function updateMarker(marker: L.Marker, latlng: { lat: number; lng: number }, h3Resolution: number, toolbarComponent: MapControl | null) {
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

<!--
  (c) 2020 Open AR Cloud
  This code is licensed under MIT license (see LICENSE.md for details)
-->

<style>
    #map {
        height: 100%;
        width: 100%;
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
