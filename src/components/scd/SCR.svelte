<!--
  (c) 2020 Open AR Cloud, This code is licensed under MIT license (see LICENSE.md for details)
  (c) 2024 Nokia, Licensed under the MIT License, SPDX-License-Identifier: MIT
-->

<script lang="ts">
    import { UploadIcon, MapIcon } from 'svelte-zondicons';

    import { goto } from '@sveltech/routify';

    import { contentRefs, geoPose } from '../../core/store';

    import Content from './Content.svelte';
    import GeoPose from './GeoPose.svelte';
    import type { SCR, SCRnoId } from '@oarc/scd-access';
    import Modal from '../Modal.svelte';
    import Map from '../Map.svelte';

    export let data: SCR | SCRnoId;

    let hasRefs = handleRefsUpdate();
    let showModal = false;

    function updateGeopose({ lat, lon }: { lat: number; lon: number }) {
        data.content.geopose.position.lat = lat;
        data.content.geopose.position.lon = lon;
    }

    function openContentEditor(event: Event) {
        event.preventDefault();

        import('../../pages/scd/admin/contenteditor/index.svelte').then(() => $goto('contenteditor/')).catch((error) => console.log(`Content editor not loaded: ${error}`));
    }

    function handleRefsUpdate() {
        return data.content.refs && data.content.refs.length > 0;
    }
</script>

<fieldset>
    <legend>
        <span>Content</span>
        <button class="editorbutton" on:click={openContentEditor}><UploadIcon class="editoricon" /></button>
    </legend>

    <Content data={data.content} on:refsUpdated={() => (hasRefs = handleRefsUpdate())} />
</fieldset>

<fieldset>
    <legend>
        <span>GeoPose</span>

        <button
            class="editorbutton"
            on:click={(event) => {
                event.preventDefault();
                contentRefs.set(data.content.refs || []);
                geoPose.set(data.content.geopose);
                showModal = true;
            }}
        >
            <MapIcon class="editoricon" />
        </button>
    </legend>

    <GeoPose data={data.content.geopose} />
</fieldset>

{#if showModal}
    <Modal on:close={() => (showModal = false)}>
        <Map {updateGeopose} onSaveCancel={() => (showModal = false)} />
    </Modal>
{/if}

<!--
    (c) 2020 Open AR Cloud
    This code is licensed under MIT license (see LICENSE.md for details)
-->

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
