<!--
    (c) 2020 Open AR Cloud
    This code is licensed under MIT license (see LICENSE.md for details)
-->

<script lang="ts">
    import Services from './Services.svelte';
    import Geometry from './Geometry.svelte';
    import type { ChangeEventHandler } from 'svelte/elements';
    import type { SSR } from '@oarc/ssd-access';

    export let data: SSR;

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
    <input id="serviceactive" type="checkbox" checked={data?.active} on:change={toggleActive} />
</div>

<fieldset class="container">
    <legend>Services</legend>
    <Services bind:data={data.services} />
</fieldset>

<fieldset class="container">
    <legend>Coverage</legend>
    <Geometry bind:data={data.geometry} />
</fieldset>

<fieldset>
    <div>
        <label for="rootaltitude">
            <input type="checkbox" checked={data?.altitude ? true : false} on:change={toggleAltitude} />
            <span>Altitude</span>
        </label>
        <input id="rootaltitude" type="number" step="0.1" class:hidden={data.altitude === undefined} bind:value={data.altitude} />
    </div>
</fieldset>
