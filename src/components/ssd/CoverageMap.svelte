<!--
  (c) 2020 Open AR Cloud, This code is licensed under MIT license (see LICENSE.md for details)
  (c) 2024 Nokia, Licensed under the MIT License, SPDX-License-Identifier: MIT
-->

<script lang="ts">
    import L from 'leaflet';
    import type { Position } from '@oarc/ssd-access';

    export let coordinates: Position[] = [];
    export let onApply: (coordinates: Position[]) => void;
    export let onCancel: () => void;

    const DEFAULT_CENTER: L.LatLngExpression = [49.410625, 8.715277];
    const DEFAULT_ZOOM = 13;
    const COLOR = '#ff7800';

    type Vertex = { lat: number; lon: number };
    type BaseName = 'Street' | 'Satellite';

    function ringVertices(ring: Position[]): Vertex[] {
        const vertices = ring
            .filter((position) => position.length >= 2 && Number.isFinite(position[0]) && Number.isFinite(position[1]))
            .map((position) => ({ lon: position[0], lat: position[1] }));

        if (vertices.length > 1) {
            const first = vertices[0];
            const last = vertices[vertices.length - 1];
            if (first.lat === last.lat && first.lon === last.lon) {
                vertices.pop();
            }
        }

        return vertices;
    }

    let vertices: Vertex[] = ringVertices(coordinates);
    let baseName: BaseName = 'Street';
    let map: L.Map | null = null;
    let streetLayer: L.TileLayer;
    let satelliteLayer: L.TileLayer;
    let polygonLayer: L.Polygon | null = null;
    let polylineLayer: L.Polyline | null = null;
    let markerLayer: L.LayerGroup | null = null;
    let panelEl: HTMLElement;
    let suppressNextMapClick = false;

    function latLngs(): L.LatLngExpression[] {
        return vertices.map((vertex) => [vertex.lat, vertex.lon]);
    }

    function redraw() {
        if (!map || !markerLayer) {
            return;
        }

        if (polylineLayer) {
            map.removeLayer(polylineLayer);
            polylineLayer = null;
        }
        if (polygonLayer) {
            map.removeLayer(polygonLayer);
            polygonLayer = null;
        }

        const pts = latLngs();
        if (vertices.length >= 3) {
            polygonLayer = L.polygon(pts, {
                color: COLOR,
                weight: 2,
                fillColor: COLOR,
                fillOpacity: 0.25,
                interactive: false,
            }).addTo(map);
        } else if (vertices.length >= 2) {
            polylineLayer = L.polyline(pts, {
                color: COLOR,
                weight: 2,
                interactive: false,
            }).addTo(map);
        }

        markerLayer.clearLayers();
        vertices.forEach((vertex, index) => {
            const marker = L.circleMarker([vertex.lat, vertex.lon], {
                radius: index === 0 ? 8 : 6,
                color: COLOR,
                fillColor: index === 0 ? '#ffffff' : COLOR,
                fillOpacity: 1,
                weight: 2,
                bubblingMouseEvents: false,
            });
            marker.bindTooltip(index === 0 ? 'First corner' : `Corner ${index + 1}`, { direction: 'top' });
            marker.on('click', (event) => {
                L.DomEvent.stopPropagation(event.originalEvent);
                suppressNextMapClick = true;
                removeVertex(index);
            });
            marker.addTo(markerLayer!);
        });
    }

    function addVertex(latlng: L.LatLng) {
        vertices = [...vertices, { lat: latlng.lat, lon: latlng.lng }];
        redraw();
    }

    function removeVertex(index: number) {
        vertices = vertices.filter((_, vertexIndex) => vertexIndex !== index);
        redraw();
    }

    function undo() {
        if (vertices.length === 0) {
            return;
        }
        vertices = vertices.slice(0, -1);
        redraw();
    }

    function clearVertices() {
        vertices = [];
        redraw();
    }

    function showBase(name: BaseName) {
        if (!map) {
            return;
        }
        const next = name === 'Street' ? streetLayer : satelliteLayer;
        const previous = name === 'Street' ? satelliteLayer : streetLayer;
        if (map.hasLayer(previous)) {
            map.removeLayer(previous);
        }
        if (!map.hasLayer(next)) {
            next.addTo(map);
        }
    }

    function apply() {
        if (vertices.length < 3) {
            return;
        }

        const ring: Position[] = vertices.map((vertex) => [vertex.lon, vertex.lat]);
        ring.push([ring[0][0], ring[0][1]]);
        onApply(ring);
    }

    function frameVertices(m: L.Map) {
        if (vertices.length === 1) {
            m.setView([vertices[0].lat, vertices[0].lon], DEFAULT_ZOOM);
        } else if (vertices.length >= 2) {
            const bounds = L.latLngBounds(vertices.map((vertex) => [vertex.lat, vertex.lon] as L.LatLngTuple));
            m.fitBounds(bounds, { padding: [48, 48] });
        }
    }

    function createMap(container: HTMLElement) {
        streetLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: `&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>`,
            maxZoom: 19,
        });

        satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: `&copy; <a href="http://www.esri.com/">Esri</a>,
                 i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community`,
            maxZoom: 18,
        });

        const center = vertices.length > 0 ? ([vertices[0].lat, vertices[0].lon] as L.LatLngExpression) : DEFAULT_CENTER;
        const m = L.map(container, {
            center,
            zoom: DEFAULT_ZOOM,
            maxZoom: 19,
            layers: [streetLayer],
            doubleClickZoom: false,
        });

        markerLayer = L.layerGroup().addTo(m);
        m.on('click', (event) => {
            if (suppressNextMapClick) {
                suppressNextMapClick = false;
                return;
            }
            addVertex(event.latlng);
        });

        map = m;
        redraw();

        requestAnimationFrame(() => {
            m.invalidateSize();
            frameVertices(m);
        });

        return m;
    }

    function guardPanel(panel: HTMLElement) {
        L.DomEvent.disableClickPropagation(panel);
        L.DomEvent.disableScrollPropagation(panel);
    }

    $: if (panelEl) {
        guardPanel(panelEl);
    }

    function mapAction(container: HTMLElement) {
        L.Icon.Default.imagePath = '/leaflet/';
        map = createMap(container);
        return {
            destroy: () => {
                map?.remove();
                map = null;
                polygonLayer = null;
                polylineLayer = null;
                markerLayer = null;
            },
        };
    }

    function resizeMap() {
        map?.invalidateSize();
    }
</script>

<div class="coverage-map">
    <div class="canvas" use:mapAction></div>
    <aside class="panel" bind:this={panelEl}>
        <fieldset>
            <legend>Display</legend>
            <div>
                <input id="coverage-street" type="radio" name="coverage-base" value="Street" bind:group={baseName} on:change={() => showBase('Street')} />
                <label for="coverage-street">Street</label>
            </div>
            <div>
                <input id="coverage-satellite" type="radio" name="coverage-base" value="Satellite" bind:group={baseName} on:change={() => showBase('Satellite')} />
                <label for="coverage-satellite">Satellite</label>
            </div>
        </fieldset>
        <fieldset>
            <legend>Polygon</legend>
            <p>Click the map to add corners. Click a corner to remove it. At least 3 corners are required.</p>
            <p class="count">{vertices.length} {vertices.length === 1 ? 'corner' : 'corners'}</p>
            {#if vertices.length > 0}
                <ol>
                    {#each vertices as vertex, index}
                        <li>{index + 1}. {vertex.lat.toFixed(5)}, {vertex.lon.toFixed(5)}</li>
                    {/each}
                </ol>
            {/if}
            <div class="row">
                <button type="button" disabled={vertices.length === 0} on:click={undo}>Undo</button>
                <button type="button" disabled={vertices.length === 0} on:click={clearVertices}>Clear</button>
            </div>
        </fieldset>
        <fieldset class="controls">
            <button type="button" disabled={vertices.length < 3} on:click={apply}>set</button>
            <button type="button" on:click={onCancel}>cancel</button>
        </fieldset>
    </aside>
</div>

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
    .coverage-map {
        position: relative;
        height: 100%;
        width: 100%;
    }

    .canvas {
        height: 100%;
        width: 100%;
    }

    .canvas :global(.leaflet-container) {
        cursor: crosshair;
        height: 100%;
        width: 100%;
        background: #ddd;
    }

    .panel {
        position: absolute;
        top: 10px;
        right: 10px;
        z-index: 1000;
        width: 16rem;
        max-height: calc(100% - 20px);
        overflow: auto;
        border-radius: 0.5rem;
        box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
        background-color: white;
        padding: 7px;
    }

    .panel p {
        margin: 0.4rem 0;
    }

    .count {
        font-weight: 700;
    }

    ol {
        margin: 0.4rem 0;
        padding-left: 1.4rem;
        font-variant-numeric: tabular-nums;
    }

    .row,
    .controls {
        display: flex;
        gap: 10px;
    }

    .row button,
    .controls button {
        flex: 1;
    }

    fieldset div {
        margin: 5px;
    }
</style>
