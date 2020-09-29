<!--
    (c) 2020 Open AR Cloud
    This code is licensed under MIT license (see LICENSE.md for details)
-->

<style>
    :global(form label, form dt) {
        display: inline-block;
        width: 7rem;
        text-align: right;
        margin-right: 10px;
    }

    :global(form dd input) {
        margin-right: 10px;
    }

    :global(form label::after, form dt::after) {
        content: ":";
    }

    :global(form dd) {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
    }

    :global(form dd span) {
        margin-right: 20px;
    }

    :global(form dd label) {
        width: initial;
    }

    :global(form .growable) {
        display: flex;
        align-items: baseline;
    }

    :global(form .growable input) {
        flex-grow: 2;
    }

    fieldset {
        border: 2px solid #0000;
        margin: 10px 0 10px;
    }

    :global(fieldset div) {
        margin: 20px;
    }

    :global(legend) {
        font-weight: 700;
    }

    :global(details) {
        border: 1px solid lightgray;
        margin-bottom: 15px;
        background-color: white;
    }

    :global(summary) {
        cursor: pointer;
        background: lightgray;
        padding: 15px 5px;
    }

    #roottype {
        font-weight: bold;
    }

    .hidden {
        visibility: hidden;
    }
</style>

<script>
    import Services from './Services.svelte';
    import Geometry from './Geometry.svelte';

    export let data;

    let form;

    export function reportValidity() {
        return form.reportValidity();
    }

    function toggleAltitude(event) {
        if (event.target.checked) {
            data.altitude = 0;
        } else {
            data.altitude = undefined;
        }
    }
</script>


<slot name="intro" />

<form bind:this={form}>
    <fieldset>
        {#if data.id}
        <div>
            <label for="rootid">ID</label>
            <span id="rootid">{data.id}</span>
        </div>
        {/if}

        <div>
            <label for="roottype">Type</label>
            <span id="roottype">{data.type.toUpperCase()}</span>
        </div>

        {#if data.provider}
        <div>
            <label for="rootprovider">Provider</label>
            <span id="rootprovider">{data.provider}</span>
        </div>
        {/if}

        <slot name="extras" />
    </fieldset>

    <fieldset class="container">
        <legend>Services</legend>
        <Services bind:data="{data.services}"/>
    </fieldset>

    <fieldset class="container">
        <legend>Coverage</legend>
        <Geometry bind:data="{data.geometry}"/>
    </fieldset>

    <fieldset>
        <div>
            <label for="rootaltitude">
                <input type="checkbox" checked="{data.altitude !== undefined}" on:change={toggleAltitude} />
                <span>Altitude</span>
            </label>
            <input id="rootaltitude" type="number" step="0.1" class:hidden="{data.altitude === undefined}" bind:value="{data.altitude}"/>
        </div>

        {#if data.timestamp}
        <div>
            <label for="roottimestamp">Last edited</label>
            <span id="roottimestamp">{data.timestamp}</span>
        </div>
        {/if}
    </fieldset>

    <slot name="controls" />
</form>