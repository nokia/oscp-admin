<script lang="ts">
    import { UploadIcon, MapIcon } from 'svelte-zondicons';

    import { goto } from '@sveltech/routify';

    import { contentRefs, geoPose } from '../../core/store';

    import Content from './Content.svelte';
    import GeoPose from './GeoPose.svelte';
    import type { SCR } from '@oarc/scd-access';

    export let data: SCR;

    let hasRefs = handleRefsUpdate();

    function openContentEditor(event: Event) {
        event.preventDefault();

        import('../../pages/scd/admin/contenteditor/index.svelte').then(() => $goto('contenteditor/')).catch((error) => console.log(`Content editor not loaded: ${error}`));
    }

    function openGeoPoseEditor(event: Event) {
        event.preventDefault();

        import('../../pages/scd/admin/geoposeeditor/index.svelte')
            .then(() => {
                contentRefs.set(data.content.refs || []);
                geoPose.set(data.content.geopose);
                $goto('geoposeeditor/');
            })
            .catch((error) => {
                console.log(`GeoPose editor not loaded: ${error}`);
            });
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

        <button class="editorbutton" disabled={!hasRefs} on:click={openGeoPoseEditor}>
            <MapIcon class="editoricon" />
        </button>
    </legend>

    <GeoPose data={data.content.geopose} />
</fieldset>

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
