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

    $: if (data.timestamp) {
        timestamp = data.timestamp;
    }

    // OSCP timestamps are Unix epoch milliseconds (UTC). Show local time, and keep that UTC value.
    function formatLastEdited(value: number): string {
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) {
            return String(value);
        }

        const local = new Intl.DateTimeFormat(undefined, {
            dateStyle: 'medium',
            timeStyle: 'medium',
        }).format(date);

        return `${local} (${value})`;
    }

    $: lastEditedLabel = timestamp ? formatLastEdited(timestamp) : '';

    export function reportValidity() {
        return form.reportValidity();
    }

    function readableRecordId(record: SCRnoId | SCR | SSR): string {
        if ('content' in record && record.content.id.trim()) {
            return record.content.id.trim();
        }

        if ('services' in record) {
            const serviceIds = record.services.map((service) => service.id.trim()).filter((id) => id.length > 0);
            if (serviceIds.length > 0) {
                return serviceIds.join('_');
            }
        }

        if ('id' in record && record.id.trim()) {
            return record.id.trim();
        }

        return 'data';
    }

    function exportFilename(record: SCRnoId | SCR | SSR): string {
        const safe = readableRecordId(record)
            .replace(/[<>:"/\\|?*\u0000-\u001f]/g, '_')
            .replace(/\s+/g, '_')
            .replace(/_+/g, '_')
            .replace(/^[_.]+|[_.]+$/g, '');

        return `${safe || 'data'}.json`;
    }

    function exportRecord(event: MouseEvent) {
        event.preventDefault();

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = exportFilename(data);
        anchor.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
</script>

<slot name="intro" />

<form novalidate bind:this={form}>
    <fieldset>
        <legend>
            <span>Export</span>
            <button type="button" class="editorbutton black-text" on:click={exportRecord}>
                <DownloadIcon class="editoricon" />
            </button>
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

        {#if lastEditedLabel}
            <div>
                <label for="roottimestamp">Last edited</label>
                <span id="roottimestamp">{lastEditedLabel}</span>
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
