<!--
  (c) 2020 Open AR Cloud, This code is licensed under MIT license (see LICENSE.md for details)
  (c) 2024 Nokia, Licensed under the MIT License, SPDX-License-Identifier: MIT
-->

<script lang="ts">
    import type { SCR, SCRnoId } from '@oarc/scd-access';
    import type { SSR } from '@oarc/ssd-access';
    import { DownloadIcon, UploadIcon } from 'svelte-zondicons';

    export let data: SCRnoId | SCR | SSR;

    let form: HTMLFormElement;
    let timestamp = 0;

    $: {
        if (data.timestamp) {
            timestamp = data.timestamp;
            delete data.timestamp;
        }
    }

    export function reportValidity() {
        return form.reportValidity();
    }
</script>

<slot name="intro" />

<form novalidate bind:this={form}>
    <fieldset>
        <legend>
            <span>Export</span>
            <a class="editorbutton black-text" download="data.json" type="text/json" href={URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)]))}>
                <DownloadIcon class="editoricon" />
            </a>
        </legend>
        {#if 'id' in data && data.id}
            <div>
                <label for="rootid">ID</label>
                <span id="rootid">{data.id}</span>
            </div>
        {/if}

        <div>
            <label for="roottype">Type</label>
            <span id="roottype">{data.type.toUpperCase()}</span>
        </div>

        {#if 'provider' in data && data.provider}
            <!-- TODO: there is no provider in SCR -->
            <div>
                <label for="rootprovider">Provider</label>
                <span id="rootprovider">{data.provider}</span>
            </div>
        {/if}

        {#if 'tenant' in data && data.tenant}
            <div>
                <label for="roottenant">Tenant</label>
                <span id="roottenant">{data.tenant}</span>
            </div>
        {/if}

        {#if timestamp}
            <div>
                <label for="roottimestamp">Last edited</label>
                <span id="roottimestamp">{timestamp}</span>
            </div>
        {/if}

        <slot name="extras" />
    </fieldset>

    <slot name="form" />

    <slot name="controls" />
</form>

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
        content: ':';
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

    :global(fieldset) {
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

    .editorbutton {
        background-color: transparent;
        border: 0;
    }

    .black-text {
        color: black;
    }

    :global(.editoricon) {
        cursor: pointer;
        width: 20px;
        vertical-align: bottom;
    }
</style>
