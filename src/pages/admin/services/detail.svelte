<!--
    (c) 2020 Open AR Cloud
    This code is licensed under MIT license (see LICENSE.md for details)
-->

<script>
    import { onMount } from 'svelte'

    import { requestService } from 'ssd-access'
    import { url, route, params } from '@sveltech/routify'

    let data = [];

    onMount(() => {
        requestService($params.countryCode, $params.id)
        .then((service) => {
            console.log('tut')
        })
        .catch(error => {
            console.log(`Server access error: ${error}`)
        })
    })

</script>

<h2>
    {#if $route.last}
        <a href="{$url($route.last.path)}"><img alt="back navigation arrow" src="/arrow_back_ios-24px.svg"/></a>
    {/if}
    <span>Service {$params.countryCode}/{$params.id} detail</span>
</h2>