<!--
  (c) 2020 Open AR Cloud, This code is licensed under MIT license (see LICENSE.md for details)
  (c) 2024 Nokia, Licensed under the MIT License, SPDX-License-Identifier: MIT
-->

<script lang="ts">
    import Keywords from './Keywords.svelte';
    import References from './References.svelte';
    import Definitions from './Definitions.svelte';
    import Modal from '../Modal.svelte';
    import Map from '../Map.svelte';
    import GeoPose from './GeoPose.svelte';
    import { MapIcon } from 'svelte-zondicons';
    import { contentRefs, geoPose } from '../../core/store';
    import { createEventDispatcher } from 'svelte';
    import type { ChangeEventHandler } from 'svelte/elements';
    import type { Content } from '@oarc/scd-access';

    export let data: Content;
    let showModal = false;

    function updateGeopose({ lat, lon }: { lat: number; lon: number }) {
        data.geopose.position.lat = lat;
        data.geopose.position.lon = lon;
    }

    const dispatch = createEventDispatcher<{ refsUpdated: undefined }>();

    const toggleSize: ChangeEventHandler<HTMLInputElement> = (event) => {
        if (event.currentTarget?.checked) {
            data.size = 0;
        } else {
            data.size = undefined;
        }
    };

    const toggleBbox: ChangeEventHandler<HTMLInputElement> = (event) => {
        if (event.currentTarget.checked) {
            data.bbox = '';
        } else {
            data.bbox = undefined;
        }
    };

    const toggleDescription: ChangeEventHandler<HTMLInputElement> = (event) => {
        if (event.currentTarget.checked) {
            data.description = '';
        } else {
            data.description = undefined;
        }
    };

    const togglePlacekey: ChangeEventHandler<HTMLInputElement> = (event) => {
        if (event.currentTarget.checked) {
            data.placekey = '';
        } else {
            data.placekey = undefined;
        }
    };
</script>

<div>
    <label for="contentid">ID</label>
    <input id="contentid" required bind:value={data.id} />
</div>

<div>
    <label for="contenttype">Type</label>
    <input id="contenttype" required bind:value={data.type} />
</div>

<div>
    <label for="contenttitle">Title</label>
    <input id="contenttitle" required bind:value={data.title} />
</div>

<div>
    <label for="contentdescription">
        <input type="checkbox" checked={data.description !== undefined} on:change={toggleDescription} />
        <span>Description</span>
    </label>
    <input id="contentdescription" disabled={data.description === undefined} bind:value={data.description} />
</div>

<Keywords bind:data={data.keywords} />

<div>
    <label for="contentplacekey">
        <input type="checkbox" checked={data.placekey !== undefined} on:change={togglePlacekey} />
        <span>Placekey</span>
    </label>
    <input id="contentplacekey" disabled={data.placekey === undefined} bind:value={data.placekey} />
</div>

<fieldset>
    <legend>
        <span>GeoPose</span>

        <button
            class="editorbutton"
            on:click={(event) => {
                event.preventDefault();
                contentRefs.set(data.refs || []);
                geoPose.set(data.geopose);
                showModal = true;
            }}
        >
            <MapIcon class="editoricon" />
        </button>
    </legend>

    <GeoPose bind:data={data.geopose} />
</fieldset>

{#if showModal}
    <Modal on:close={() => (showModal = false)}>
        <Map {updateGeopose} onSaveCancel={() => (showModal = false)} />
    </Modal>
{/if}

<References bind:data={data.refs} geopose={data.geopose} on:refsUpdated={() => dispatch('refsUpdated')} />

<Definitions bind:data={data.definitions} />

<div>
    <label for="contentsize">
        <input type="checkbox" checked={data.size !== undefined} on:change={toggleSize} />
        <span>Size</span>
    </label>
    <input id="contentsize" disabled={data.size === undefined} type="number" bind:value={data.size} />
</div>

<div>
    <label for="contentbbox">
        <input type="checkbox" checked={data.bbox !== undefined} on:change={toggleBbox} />
        <span>Bounding Box</span>
    </label>
    <input id="contentbbox" disabled={data.bbox === undefined} bind:value={data.bbox} />
</div>

<style>
    .editorbutton {
        background-color: transparent;
        border: 0;
    }

    :global(.editoricon) {
        cursor: pointer;
        width: 20px;
        vertical-align: bottom;
    }
</style>
