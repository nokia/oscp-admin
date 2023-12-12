<!--
    (c) 2020 Open AR Cloud
    This code is licensed under MIT license (see LICENSE.md for details)
-->

<script lang="ts">
    import { url, route } from '@sveltech/routify';

    import { geoPose } from '../../../../core/store';

    import P2p from '../../../../components/scd/P2p.svelte';
    import GeoPose from '../../../../components/scd/GeoPose.svelte';

    import { CheveronLeftIcon } from 'svelte-zondicons';

    let returnPath = ($route as any).last ? ($route as any).last?.path : '/scd/admin/geoposeeditor';

    let isP2pConnected = false;

    function p2pConnected() {
        isP2pConnected = true;
    }

    function p2pDisconnected() {
        isP2pConnected = false;
    }

    const urlReturnPath = (): any => {
        return $url(returnPath);
    };
</script>

<h2>
    <a href={urlReturnPath()}>
        <CheveronLeftIcon />
    </a>
    <span>GeoPose Editor Admin</span>
</h2>

{#if $geoPose}
    <form class:invisible={isP2pConnected === false}>
        <!--<GeoPose inactive="{isP2pConnected === false}" data="{$geoPose}" />-->
        <GeoPose data={$geoPose} />
    </form>
{/if}
<P2p on:connected={p2pConnected} on:disconnected={p2pDisconnected} />
