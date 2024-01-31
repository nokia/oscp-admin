<!--
  (c) 2020 Open AR Cloud, This code is licensed under MIT license (see LICENSE.md for details)
  (c) 2024 Nokia, Licensed under the MIT License, SPDX-License-Identifier: MIT
-->

<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import * as h3Lib from 'h3-js';

    import { ReloadIcon, ExploreIcon } from 'svelte-zondicons';

    import { MIN_H3RESOLUTION, DEFAULT_H3RESOLUTION, MAX_H3RESOLUTION, H3RESOLUTION_AUTO } from '../core/store.js';
    import { geoPose } from '../core/store.js';
    import type { StreetOrSatellite } from '../types/map.js';
    import type { KeyboardEventHandler } from 'svelte/elements';

    export let h3ResolutionType = false;
    export let h3Resolution = $DEFAULT_H3RESOLUTION;

    export let lat: number;
    export let lon: number;
    export let h3: h3Lib.H3IndexInput;
    export let onSaveCancel: () => void;
    export let updateGeopose: ({ lat, lon }: { lat: number; lon: number }) => void;
    type Service = { title?: string; id?: string; url?: string };
    type Record = { id: string; services: Service[] };

    export let geoPoseServices: Record[] = [];

    const dispatch = createEventDispatcher<{
        movemarker: { lat: number; lon: number; h3: h3Lib.H3IndexInput };
        'change-h3resolution': number;
        'change-display': { add: StreetOrSatellite; remove: StreetOrSatellite };
        'check-geoposeservices': h3Lib.H3IndexInput;
        'select-geoposeservice': string;
        checkcontent: {
            lat: number;
            lon: number;
            h3: h3Lib.H3IndexInput;
        };
    }>();

    const fakePos = {
        lat: 48.661773184610375,
        lon: 8.695943579077722,
        h3: '871faa49dffffff',
    };

    let currentService: Service = {};
    let serviceId = (recordId: string, serviceId: string | undefined) => `${recordId}-${serviceId}`;

    function preventDefault(event: Event) {
        event.stopPropagation();
    }

    function handleH3Resolution() {
        dispatch('change-h3resolution', h3ResolutionType ? h3Resolution : $H3RESOLUTION_AUTO);
    }

    function handleDisplay(add: StreetOrSatellite, remove: StreetOrSatellite) {
        dispatch('change-display', { add: add, remove: remove });
    }

    function handleSave() {
        geoPose.update((current) => {
            if (current?.position) {
                current.position.lat = lat;
                current.position.lon = lon;
                current.h3 = h3;
            }
            return current;
        });
        updateGeopose({ lat, lon });
        onSaveCancel();
    }

    function handleCancel() {
        onSaveCancel();
    }

    function checkForGeoPoseServices() {
        dispatch('check-geoposeservices', h3);
    }

    function handleGeoPoseServiceSelect(record: Record, service: Service) {
        currentService = {
            id: serviceId(record.id, service.id),
            url: service.url,
        };
        dispatch('select-geoposeservice', record.id);
    }

    function handleCheckContent() {
        dispatch('checkcontent', {
            lat: lat,
            lon: lon,
            h3: h3,
        });
    }

    const handleKeyup: KeyboardEventHandler<HTMLInputElement> = (event) => {
        if (event.code === 'Enter') {
            dispatch('movemarker', {
                lat: lat,
                lon: lon,
                h3: h3,
            });
        }
    };

    function panToFakePos() {
        ({ lat, lon, h3 } = fakePos);
        dispatch('movemarker', fakePos);
    }
</script>

<aside on:click={preventDefault} on:dblclick={preventDefault}>
    <fieldset>
        <legend>Display</legend>
        <div>
            <input id="displaystreet" type="radio" name="displayinfo" value="streetLayer" on:change={() => handleDisplay('Street', 'Satellite')} />
            <label for="displaystreet">Street</label>
        </div>
        <div>
            <input id="displaysatellite" type="radio" name="displayinfo" value="satelliteLayer" checked on:change={() => handleDisplay('Satellite', 'Street')} />
            <label for="displaysatellite">Satellite</label>
        </div>
    </fieldset>
    <fieldset>
        <legend>Grid Resolution</legend>
        <div>
            <input id="autogridres" type="checkbox" bind:checked={h3ResolutionType} on:change={handleH3Resolution} />
            {#if h3ResolutionType}
                <input id="h3resolution" type="number" min={$MIN_H3RESOLUTION} max={$MAX_H3RESOLUTION} disabled={!h3ResolutionType} bind:value={h3Resolution} on:change={handleH3Resolution} />
            {:else}
                <span class="placeholder">Auto</span>
            {/if}
        </div>
    </fieldset>
    <fieldset>
        <legend>
            <span>Position</span>
            <button class="iconwrapper" on:click={panToFakePos}><ExploreIcon size="1rem" /></button>
        </legend>
        <div>
            <label for="lat">Lat</label>
            <input id="lat" type="number" step="any" bind:value={lat} on:keyup|preventDefault={handleKeyup} />
        </div>
        <div>
            <label for="lon">Lon</label>
            <input id="lon" type="number" step="any" bind:value={lon} on:keyup|preventDefault={handleKeyup} />
        </div>
        <div>
            <label for="h3">H3</label>
            <input id="h3" bind:value={h3} on:keyup|preventDefault={handleKeyup} />
        </div>
    </fieldset>
    <fieldset>
        <legend>
            <span class="clickable" on:click={checkForGeoPoseServices}>GeoPose Service</span>
            <button class="iconwrapper" on:click={checkForGeoPoseServices}><ReloadIcon size="1rem" /></button>
        </legend>
        <ul id="geoposeservices">
            {#if geoPoseServices.length > 0}
                {#each geoPoseServices as record}
                    {#each record.services as service}
                        <li class:selected={currentService.id === serviceId(record.id, service.id)} on:click={() => handleGeoPoseServiceSelect(record, service)}>
                            {service.title}
                        </li>
                    {/each}
                {/each}
            {:else}
                <li>No services</li>
            {/if}
        </ul>
        <button id="checkcontent" disabled={currentService.id === undefined} on:click={handleCheckContent}> check </button>
    </fieldset>
    <fieldset id="controls">
        <button on:click={handleSave}>set</button>
        <button on:click={handleCancel}>cancel</button>
    </fieldset>
</aside>

<!--
  (c) 2020 Open AR Cloud
  This code is licensed under MIT license (see LICENSE.md for details)
-->

<style>
    aside {
        border-radius: 0.5rem;
        box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
        background-color: white;
        padding: 7px;
    }

    input#h3resolution {
        width: 2rem;
    }

    fieldset#controls {
        display: flex;
        align-content: stretch;
    }

    fieldset#controls button {
        flex-grow: 1;
    }

    fieldset#controls button:first-child {
        margin-right: 10px;
    }

    fieldset div {
        margin: 5px;
    }

    fieldset label {
        width: 2rem;
        display: inline-block;
        text-align: right;
    }

    fieldset label:after {
        content: ':';
    }

    fieldset input {
        width: unset;
    }

    #geoposeservices li {
        padding: 6px;
        cursor: pointer;
    }

    #geoposeservices li.selected {
        background-color: #ffc5b2;
    }

    #checkcontent {
        width: 100%;
    }

    .placeholder {
        padding: 4px 0 9px 5px;
        display: inline-block;
    }

    .clickable {
        cursor: pointer;
    }
</style>
