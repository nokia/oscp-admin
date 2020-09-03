<!--
    (c) 2020 Open AR Cloud
    This code is licensed under MIT license (see LICENSE.md for details)
-->

<script>
    import { onMount } from 'svelte'

    import { getServiceWithId } from 'ssd-access'
    import { url, route, params } from '@sveltech/routify'
    import { authStore } from '../../core/auth.js'

    import KeyValue from '../../components/tree/KeyValue.svelte'


    let data = [];

    onMount(() => {
        getServiceWithId($params.countryCode, $params.id)
        .then((services) => data = services)
        .catch(error => console.log(`Server access error: ${error}`))
    })

    function handleDelete() {
        authStore.getTokenSilently()
        .then(token => {
            fetch(`https://dev1.ssd.oscp.cloudpose.io:7000/${$params.countryCode}/ssrs/${$params.id}`, {
                headers: {Authorization: `Bearer ${token}`}
            })
            .then(result => result.text())
            .then(data => console.log(data))
            .catch(error => console.error(`Failed to delete: ${error}`))
        })
        .catch(error => console.error(`Failed to get token: ${error}`))
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
    {#if $route.last}
        <a href="{$url($route.last.path)}"><img alt="back navigation arrow" src="/arrow_back_ios-24px.svg"/></a>
    {/if}
    <span>Service detail</span>
</h2>

<div id="detail">
    <div>
        <KeyValue name="{$params.countryCode}/{$params.id}" values="{data}" expanded/>
    </div>
</div>

<button on:click={handleDelete}>Delete</button>
<button disabled>Save</button>

