<!--
  (c) 2020 Open AR Cloud, This code is licensed under MIT license (see LICENSE.md for details)
  (c) 2024 Nokia, Licensed under the MIT License, SPDX-License-Identifier: MIT
-->

<script lang="ts">
    import { UploadIcon } from 'svelte-zondicons';

    import { goto } from '@sveltech/routify';

    import Content from './Content.svelte';
    import type { SCR, SCRnoId } from '@oarc/scd-access';

    export let data: SCR | SCRnoId;

    let hasRefs = handleRefsUpdate();

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
