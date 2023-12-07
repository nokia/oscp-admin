<!--
    (c) 2020 Open AR Cloud
    This code is licensed under MIT license (see LICENSE.md for details)
-->

<script>
    import { url, route } from '@roxi/routify';

    import { geoPose } from '../../../../core/store.js';

    import P2p from '../../../../components/scd/P2p.svelte';
    import GeoPose from '../../../../components/scd/GeoPose.svelte';

    import { CheveronLeftIcon } from 'svelte-zondicons';

    let returnPath = $route.last ? $route.last.path : '/scd/admin/geoposeeditor';

    let isP2pConnected = false;

    function p2pConnected() {
        isP2pConnected = true;
    }

    function p2pDisconnected() {
        isP2pConnected = false;
    }
</script>

<h2>
    <a href={$url(returnPath)}>
        <CheveronLeftIcon />
    </a>
    <span>GeoPose Editor Admin</span>
</h2>

<form class:invisible={isP2pConnected === false}>
    <!--<GeoPose inactive="{isP2pConnected === false}" data="{$geoPose}" />-->
    <GeoPose data={$geoPose} />
</form>
<P2p on:connected={p2pConnected} on:disconnected={p2pDisconnected} />
