<!--
  (c) 2020 Open AR Cloud, This code is licensed under MIT license (see LICENSE.md for details)
  (c) 2024 Nokia, Licensed under the MIT License, SPDX-License-Identifier: MIT
-->

<script lang="ts">
    import Services from './Services.svelte';
    import Geometry from './Geometry.svelte';
    import Modal from '../Modal.svelte';
    import CoverageMap from './CoverageMap.svelte';
    import { MapIcon } from 'svelte-zondicons';
    import type { ChangeEventHandler } from 'svelte/elements';
    import type { Position, SSR } from '@oarc/ssd-access';

    export let data: SSR;

    let showCoverageMap = false;
    let coverageOpen = false;

    function openCoverageMap(event: Event) {
        event.preventDefault();
        showCoverageMap = true;
    }

    function applyCoveragePolygon(coordinates: Position[]) {
        data.geometry = {
            ...data.geometry,
            coordinates: [coordinates],
        };
        coverageOpen = true;
        showCoverageMap = false;
    }

    const toggleAltitude: ChangeEventHandler<HTMLInputElement> = (event) => {
        if (event.currentTarget.checked) {
            data.altitude = 0;
        } else {
            data.altitude = undefined;
        }
    };

    const toggleActive: ChangeEventHandler<HTMLInputElement> = (event) => {
        data.active = !!event.currentTarget.checked;
    };
</script>

<div>
    <label for="serviceactive">Active</label>
    <input id="serviceactive" type="checkbox" checked={data.active ?? true} on:change={toggleActive} />
</div>

<fieldset class="container">
    <legend>Services</legend>
    <Services bind:data={data.services} />
</fieldset>

<fieldset class="container">
    <legend>
        <span>Coverage</span>
        <button type="button" class="editorbutton" title="Draw coverage polygon" on:click={openCoverageMap}>
            <MapIcon class="editoricon" />
        </button>
    </legend>
    <Geometry bind:data={data.geometry} bind:open={coverageOpen} />
</fieldset>

{#if showCoverageMap}
    <Modal on:close={() => (showCoverageMap = false)}>
        <CoverageMap coordinates={data.geometry.coordinates[0] ?? []} onApply={applyCoveragePolygon} onCancel={() => (showCoverageMap = false)} />
    </Modal>
{/if}

<fieldset>
    <div>
        <label for="rootaltitude">
            <input type="checkbox" checked={data?.altitude ? true : false} on:change={toggleAltitude} />
            <span>Altitude</span>
        </label>
        <input id="rootaltitude" type="number" step="0.1" class:hidden={data.altitude === undefined} bind:value={data.altitude} />
    </div>
</fieldset>

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
