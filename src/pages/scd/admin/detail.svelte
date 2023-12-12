<!--
    (c) 2020 Open AR Cloud
    This code is licensed under MIT license (see LICENSE.md for details)
-->

<script lang="ts">
    import { onMount } from 'svelte';
    import { url, route, params, goto } from '@roxi/routify';

    import { authStore, getContentWithId, deleteWithId, validateScr, putContent, type SCR } from '@oarc/scd-access';
    import { oscpScdUrl } from '../../../core/store';

    import Form from '../../../components/Form.svelte';
    import SCRComponent from '../../../components/scd/SCR.svelte';

    import { CheveronLeftIcon } from 'svelte-zondicons';
    import type { MouseEventHandler } from 'svelte/elements';

    let data: SCR;
    let returnPath = ($route as any).last ? ($route as any).last.path : '/scd/admin/editcontent';

    onMount(() => {
        getContentWithId($oscpScdUrl, $params.topic, $params.id)
            .then((contents) => (data = contents))
            .catch((error) => console.log(`Server access error: ${error}`));
    });

    function handleDelete() {
        // TODO: Show dialog - maybe

        authStore
            .getToken()
            .then((token) => {
                deleteWithId($oscpScdUrl, $params.topic, $params.id, token || '');
            })
            .then(() => $goto(returnPath))
            .catch((error) => console.error(`Failed to delete: ${error}`));
    }

    const handleSave: MouseEventHandler<HTMLButtonElement> = (event) => {
        event.preventDefault();

        const dataString = JSON.stringify(data);
        validateScr(dataString);
        authStore
            .getToken()
            .then((token) => putContent($oscpScdUrl, $params.topic, dataString, data.id, token || ''))
            .then((response) => {
                console.log(`Record created: ${response}`);
                $goto(returnPath);
            })
            .catch((error) => {
                console.log(`New SCR not sent - ${error}`);
            });
    };
    const urlReturnPath = (): any => {
        return $url(returnPath);
    };
</script>

<h2>
    <a href={urlReturnPath()}>
        <CheveronLeftIcon />
    </a>
    <span>SCR record detail</span>
</h2>

<Form {data}>
    <p slot="intro">Edit SCR record.</p>

    <div slot="form">
        <SCRComponent bind:data />
    </div>

    <div slot="controls">
        <button on:click={handleSave}>Save</button>
    </div>
</Form>

<button on:click={handleDelete}>Delete</button>
