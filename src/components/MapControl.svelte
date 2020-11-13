<!--
  (c) 2020 Open AR Cloud
  This code is licensed under MIT license (see LICENSE.md for details)
-->

<style>
    aside {
        border-radius: .5rem;
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

<script>
    import {createEventDispatcher} from 'svelte';

    import { route, goto } from '@sveltech/routify';

    import { ReloadIcon, ExploreIcon } from 'svelte-zondicons';

    import { MIN_H3RESOLUTION, DEFAULT_H3RESOLUTION, MAX_H3RESOLUTION, H3RESOLUTION_AUTO } from '../core/store.js';
    import { geoPose } from '../core/store.js';

    export let h3ResolutionType = false;
    export let h3Resolution = $DEFAULT_H3RESOLUTION;

    export let lat;
    export let lon;
    export let h3;

    export let geoPoseServices = [];

    const dispatch = createEventDispatcher();

    const fakePos = {
        lat: 48.661773184610375,
        lon: 8.695943579077722,
        h3: "871faa49dffffff"
    }

    let savePath = $route.last ? $route.last.path : '/scd/admin/editservice';
    const cancelPath = '/scd/admin/createservice';

    let currentService = {};
    let serviceId = (recordId, serviceId) => `${recordId}-${serviceId}`;


    function preventDefault(event) {
        event.stopPropagation();
    }

    function handleH3Resolution() {
        dispatch('change-h3resolution', h3ResolutionType ? h3Resolution : $H3RESOLUTION_AUTO);
    }

    function handleDisplay(add, remove) {
        dispatch('change-display', {add: add, remove: remove});
    }

    function handleSave() {
        geoPose.update((current) => {
            current.latitude = lat;
            current.longitude = lon;
            return current;
        })

        $goto(savePath)
    }

    function handleCancel() {
        $goto(cancelPath);
    }

    function checkForGeoPoseServices() {
        dispatch('check-geoposeservices', h3);
    }

    function handleGeoPoseServiceSelect(record, service) {
        currentService = {
            id: serviceId(record.id, service.id),
            url: service.url
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

    function handleKeyup(event) {
        if (event.code === 'Enter') {
            dispatch('movemarker', {
                lat: lat,
                lon: lon,
                h3: h3
            });
        }
    }

    function panToFakePos() {
        ({lat, lon, h3} = fakePos);
        dispatch('movemarker', fakePos);
    }
</script>


<aside on:click={preventDefault} on:dblclick={preventDefault}>
    <fieldset>
        <legend>Display</legend>
        <div>
            <input id="displaystreet" type="radio" name="displayinfo"
                   value="streetLayer" on:change={() => handleDisplay('Street', 'Satellite')} />
            <label for="displaystreet">Street</label>
        </div>
        <div>
            <input id="displaysatellite" type="radio" name="displayinfo"
                   value="satelliteLayer" checked on:change={() => handleDisplay('Satellite', 'Street')} />
            <label for="displaysatellite">Satellite</label>
        </div>
    </fieldset>
    <fieldset>
        <legend>Grid Resolution</legend>
        <div>
            <input id="autogridres" type="checkbox" bind:checked="{h3ResolutionType}" on:change={handleH3Resolution}/>
            {#if h3ResolutionType}
                <input id="h3resolution" type="number"
                       min="{$MIN_H3RESOLUTION}" max="{$MAX_H3RESOLUTION}" disabled="{!h3ResolutionType}"
                       bind:value="{h3Resolution}" on:change={handleH3Resolution}/>
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
                    <li
                            class:selected={currentService.id === serviceId(record.id, service.id)}
                            on:click={() => handleGeoPoseServiceSelect(record, service)}>
                        {service.title}
                    </li>
                {/each}
            {/each}
        {:else}
            <li>No services</li>
        {/if}
        </ul>
        <button id="checkcontent" disabled="{currentService.id === undefined}" on:click={handleCheckContent}>
            check
        </button>
    </fieldset>
    <fieldset id="controls">
        <button on:click={handleSave}>set</button>
        <button on:click={handleCancel}>cancel</button>
    </fieldset>
</aside>
