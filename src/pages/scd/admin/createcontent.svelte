<!--
    (c) 2020 Open AR Cloud
    This code is licensed under MIT license (see LICENSE.md for details)
-->

<script lang="ts">
    import { scr_empty, validateScr, postContent, type SCR_EMPTY, type FormContent, type SCD } from '@oarc/scd-access';
    import { authStore } from '@oarc/scd-access/authstore.js';
    import { oscpScdUrl } from '../../../core/store';

    import { goto, params } from '@roxi/routify';

    import deepMerge from 'deepmerge';

    import Form from '../../../components/Form.svelte';
    import Topic from '../../../components/scd/Topic.svelte';
    import SCR from '../../../components/scd/SCR.svelte';

    let form: Form;
    let topicElement: Topic;

    let data: SCR_EMPTY & FormContent & SCD = JSON.parse(JSON.stringify(scr_empty));
    let selection = $params.selection;

    if (selection !== undefined && selection.length > 2) {
        // TODO: Remove the data from the browser location
        data = deepMerge(data, JSON.parse(selection));
    }

    async function save(event: Event) {
        event.preventDefault();

        if (!form.reportValidity()) {
            event.preventDefault();
            console.log(`New SCR not sent - Form invalid`);
            return;
        }
        const dataString = JSON.stringify(data);
        try {
            await validateScr(dataString);
            const token = await authStore.getToken();
            const response = await postContent($oscpScdUrl, topicElement.value(), dataString, token);
            console.log(response);
            $goto('/scd');
        } catch (error) {
            console.log(`New SCR not sent - ${error}`);
        }
    }
</script>

<h2>Create Spatial Content Record</h2>

<Form bind:data bind:this={form}>
    <p slot="intro">Enter data for new SCR record.</p>

    <div slot="extras">
        <Topic bind:this={topicElement} />
    </div>

    <div slot="form">
        <SCR bind:data />
    </div>

    <div slot="controls">
        <button on:click={save}>Save</button>
        <button type="reset">Reset</button>
    </div>
</Form>
