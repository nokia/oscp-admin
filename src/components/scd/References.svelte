<!--
  (c) 2020 Open AR Cloud, This code is licensed under MIT license (see LICENSE.md for details)
  (c) 2024 Nokia, Licensed under the MIT License, SPDX-License-Identifier: MIT
-->

<script lang="ts">
    import { AddSolidIcon, CloseSolidIcon, ExploreIcon } from 'svelte-zondicons';
    import { scr_reference, type Ref, type Geopose } from '@oarc/scd-access';
    import { createEventDispatcher } from 'svelte';
    import ContenViewer from '../../pages/scd/admin/contentviewer/ContentViewer.svelte';

    export let data: Ref[] | undefined;
    export let geopose: Geopose;

    const dispatch = createEventDispatcher();

    function addReference() {
        if (data) {
            data = [...data, JSON.parse(JSON.stringify(scr_reference))];
        } else {
            data = [JSON.parse(JSON.stringify(scr_reference))];
        }

        dispatch('refsUpdated');
    }

    function deleteReference(event: Event, index: number) {
        data?.splice(index, 1);
        data = data;

        dispatch('refsUpdated');
    }

    function addFakeReference() {
        const model = JSON.parse(JSON.stringify(scr_reference));
        model.contentType = 'model/gltf+json';
        model.url = '/content/s1.gltf';

        const reference = JSON.parse(JSON.stringify(scr_reference));
        reference.contentType = 'image/png';
        reference.url = '/content/PXL_20201102_142648945.png';

        data = [...(data || []), model, reference];

        dispatch('refsUpdated');
    }
</script>

<dl>
    <dt>
        <span>Refs</span>
        <button class="iconwrapper" on:click|preventDefault={addFakeReference}><ExploreIcon size="1rem" /></button>
    </dt>
    {#if data}
        {#each data as reference, index}
            <dd>
                <span>
                    <label for="contenttype">Content Type</label>
                    <input id="contenttype" required bind:value={reference.contentType} />
                </span>
                <span>
                    <label for="url">URL</label>
                    <input id="url" required type="url" bind:value={reference.url} />
                    <button class="deletebutton" on:click|preventDefault={(event) => deleteReference(event, index)}>
                        <CloseSolidIcon size="1.5rem" color="red" />
                    </button>
                </span>
            </dd>

            {#if reference}
                <div style="position: relative; width: 300px; height: 300px; margin-bottom: 50px;">
                    <ContenViewer {geopose} contentMimeType={reference.contentType} contentUrl={reference.url}></ContenViewer>
                </div>
            {/if}
        {/each}
    {/if}
</dl>

{#if data !== undefined}
    <button class="addbutton" on:click|preventDefault={addReference}>
        <AddSolidIcon size="2rem" />
    </button>
{/if}

<style>
    .addbutton {
        background-color: transparent;
        border: 0;
    }

    .deletebutton {
        padding: 0;
        margin: 0 15px 0 -5px;
        border: 0;
        background-color: transparent;
    }
</style>
