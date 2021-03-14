<!--
    (c) 2020 Open AR Cloud
    This code is licensed under MIT license (see LICENSE.md for details)
-->

<script>
    import { onMount } from 'svelte';
    import { url, route, params, goto } from '@sveltech/routify';

    import {getServiceWithId, deleteWithId, validateSsr, putService} from 'ssd-access';
    import { ssr_empty } from 'ssd-access';
    import { authStore } from 'ssd-access/authstore.js';

    import Form from '../../../components/Form.svelte';
    import SSR from '../../../components/ssd/SSR.svelte';


    let data = ssr_empty;
    let returnPath = $route.last ? $route.last.path : '/ssd/admin/editservice';


    onMount(() => {
        getServiceWithId($params.countryCode, $params.id)
        .then((services) => data = services)
        .catch(error => console.log(`Server access error: ${error}`))
    })

    function handleDelete() {
        // TODO: Show dialog - maybe

        authStore.getToken()
        .then(token => { deleteWithId($params.countryCode, $params.id, token)})
        .then(() => $goto(returnPath))
        .catch(error => console.error(`Failed to delete: ${error}`))
    }

    function handleSave(event) {
        event.preventDefault();

        const dataString = JSON.stringify(data);
        validateSsr(dataString)
            .then(() => authStore.getToken())
            .then(token => putService($params.countryCode, dataString, data.id, token))
            .then(response => {
                console.log(`Record created: ${response}`);
                $goto(returnPath);
            })
            .catch(error => {
                console.log(`New SSR not sent - ${error}`);
            });
    }
</script>


<h2>
    <a href="{$url(returnPath)}"><img class="backarrow" alt="back navigation arrow" src="/arrow_back_ios-24px.svg"/></a>
    <span>SSR record detail</span>
</h2>

<Form {data}>
    <p slot="intro">Edit SSR record.</p>

    <div slot="form">
        <SSR bind:data/>
    </div>

    <div slot="controls">
        <button on:click={handleSave}>Save</button>
    </div>
</Form>

<button on:click={handleDelete}>Delete</button>

