<!--
  (c) 2020 Open AR Cloud, This code is licensed under MIT license (see LICENSE.md for details)
  (c) 2024 Nokia, Licensed under the MIT License, SPDX-License-Identifier: MIT
-->

<script lang="ts">
    import { authStore, postContent, scr_empty } from '@oarc/scd-access';
    import { oscpScdUrl, newContentToCreate, geoPose, topicName } from '../../../core/store';

    import { goto, params } from '@sveltech/routify';

    import deepMerge from 'deepmerge';

    import Form from '../../../components/Form.svelte';
    import Topic from '../../../components/scd/Topic.svelte';
    import SCRComponent from '../../../components/scd/SCR.svelte';
    import { onMount } from 'svelte';

    let form: Form;
    let topicElement: Topic;

    let selection = $params.selection;

    onMount(() => {
        newContentToCreate.update((current) => {
            if ($geoPose?.position) {
                current.content.geopose.position = $geoPose.position;
            }
            return current;
        });
        if (selection !== undefined && selection.length > 2) {
            // TODO: Remove the data from the browser location
            $newContentToCreate = deepMerge($newContentToCreate, JSON.parse(selection));
        }
    });

    async function save(event: Event) {
        event.preventDefault();

        if (!form.reportValidity()) {
            event.preventDefault();
            console.log(`New SCR not sent - Form invalid`);
            return;
        }
        try {
            const token = await authStore.getToken();
            $newContentToCreate.timestamp = Date.now();
            const response = await postContent($oscpScdUrl, topicElement.value(), $newContentToCreate, token || '');
            $newContentToCreate = scr_empty;
            $topicName = '';
            console.log(response);
            $goto('/scd');
        } catch (error) {
            console.log(`New SCR not sent - ${error}`);
        }
    }
</script>

<h2>Create Spatial Content Record</h2>

<Form bind:data={$newContentToCreate} bind:this={form}>
    <p slot="intro">Enter data for new SCR record.</p>

    <div slot="extras">
        <Topic bind:this={topicElement} />
    </div>

    <div slot="form">
        <SCRComponent bind:data={$newContentToCreate} />
    </div>

    <div slot="controls">
        <button on:click={save}>Save</button>
        <button type="reset">Reset</button>
    </div>
</Form>
