<!--
  (c) 2020 Open AR Cloud, This code is licensed under MIT license (see LICENSE.md for details)
  (c) 2024 Nokia, Licensed under the MIT License, SPDX-License-Identifier: MIT
-->

<script lang="ts">
    import { availableServiceTypes, ssr_service, type Service } from '@oarc/ssd-access';

    import { AddSolidIcon, CloseSolidIcon } from 'svelte-zondicons';
    import Properties from './Properties.svelte';

    export let data: Service[];

    function addService(event: Event) {
        event.preventDefault();

        data = [...data, JSON.parse(JSON.stringify(ssr_service))];
    }

    function removeService(event: Event, index: number) {
        event.preventDefault();

        data.splice(index, 1);
        data = data;
    }
</script>

{#each data as service, index}
    {@const idPrefix = `service${index + 1}-`}
    <details>
        <summary>
            <span>{service.title} - </span>
            <span>{service['type']}</span>
            <button class="floatright buttondelete" on:click={(event) => removeService(event, index)}>
                <CloseSolidIcon size="1.5rem" color="red" />
            </button>
        </summary>

        <div class="growable">
            <label for={`${idPrefix}serviceid`}>ID</label>
            <input id={`${idPrefix}serviceid`} required bind:value={service.id} />
        </div>

        <div>
            <label for={`${idPrefix}servicetype`}>Type</label>
            <select id={`${idPrefix}servicetype`} bind:value={service.type} required>
                <option></option>
                {#each availableServiceTypes as serviceType}
                    <option value={serviceType.toLowerCase()}>{serviceType}</option>
                {/each}
            </select>
        </div>

        <div class="growable">
            <label for={`${idPrefix}servicetitle`}>Title</label>
            <input id={`${idPrefix}servicetitle`} required bind:value={service.title} />
        </div>

        <div class="growable">
            <label for={`${idPrefix}servicedescription`}>Description</label>
            <input id={`${idPrefix}servicedescription`} bind:value={service.description} />
        </div>

        <div class="growable">
            <label for={`${idPrefix}serviceurl`}>URL</label>
            <input id={`${idPrefix}serviceurl`} required type="url" bind:value={service.url} />
        </div>

        <Properties bind:data={service.properties} {idPrefix} />
    </details>
{/each}

<button class="buttonadd" on:click={addService}>
    <AddSolidIcon size="2rem" color="white" />
</button>

<style>
    details:last-child {
        margin-bottom: 0;
    }

    .buttonadd {
        width: 100%;
        background-color: black;
        cursor: pointer;
    }
</style>
