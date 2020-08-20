<!--
    (c) 2020 Open AR Cloud
    This code is licensed under MIT license (see LICENSE.md for details)
-->

<script>
    import { onMount } from 'svelte'

    import { requestService } from 'ssd-access'
    import { url, route, params } from '@sveltech/routify'

    import KeyValue from '../../../components/tree/KeyValue.svelte'


    let data = [];

    onMount(() => {
        requestService($params.countryCode, $params.id)
        .then((services) => {
            data = services
        })
        .catch(error => {
            console.log(`Server access error: ${error}`)
        })
    })
</script>

<style>
    #detail {
        display: flex;
        justify-content: center;
        margin-top: 3em;
    }
</style>

<h2>
    {#if $route.last}
        <a href="{$url($route.last.path)}"><img alt="back navigation arrow" src="/arrow_back_ios-24px.svg"/></a>
    {/if}
    <span>Service {$params.countryCode}/{$params.id} detail</span>
</h2>

<div id="detail">
    <div>
        <KeyValue name="" values="{data}" expanded/>
    </div>
</div>