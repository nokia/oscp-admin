<script>
    import { goto } from '@roxi/routify';

    function loadSsd() {
        import('./ssd/index.svelte').then(() => $goto('/ssd')).catch((error) => console.log(`ssd not loaded: ${error}`));
    }

    function loadScd() {
        import('./scd/index.svelte').then(() => $goto('/scd')).catch((error) => console.log(`scd not loaded: ${error}`));
    }
</script>

<h2>Welcome</h2>

<p>
    Sample admin app for the services offered by Open Spatial Computing Platform of Open AR Cloud. The idea is to offer main functionality available as standard web components, to make it as easy as
    possible to integrate access to the services into existing cms already in use by companies.
</p>

<dl>
    <dt>Currently available services are:</dt>
    <dd><button on:click={loadSsd}>Spatial Service Discovery</button></dd>
    <dd><button on:click={loadScd}>Spatial Content Discovery</button></dd>
</dl>

<!--
    (c) 2020 Open AR Cloud
    This code is licensed under MIT license (see LICENSE.md for details)
-->

<style>
    button {
        color: blue;
        margin: 0;
        padding: 3px;
        border: 0;
        cursor: pointer;
        background-color: white;
    }
</style>
