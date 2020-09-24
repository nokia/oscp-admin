<!--
    (c) 2020 Open AR Cloud
    This code is licensed under MIT license (see LICENSE.md for details)
-->

<script>
    import { onMount } from 'svelte'
    import { url, route, params, goto } from '@sveltech/routify'

    import { getServiceWithId, deleteWithId, ssr_schema } from 'ssd-access'
    import { authStore } from 'ssd-access/authstore.js'

    import KeyValue from '../../components/tree/KeyValue.svelte'


    let data = [];
    let returnPath = $route.last ? $route.last.path : '';

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
</script>

<style>
    #detail {
        display: flex;
        flex-direction: row;
        justify-content: center;
        margin-top: 3em;
    }
</style>

<h2>
    <a href="{$url(returnPath)}"><img alt="back navigation arrow" src="/arrow_back_ios-24px.svg"/></a>
    <span>Service detail</span>
</h2>

<div id="detail">
    <div>
        <KeyValue name="{$params.countryCode}/{$params.id}" schema="{ssr_schema}" values="{data}" expanded/>
    </div>
</div>

<button on:click={handleDelete}>Delete</button>
<button disabled>Save</button>

