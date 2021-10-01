<!--
    (c) 2020 Open AR Cloud
    This code is licensed under MIT license (see LICENSE.md for details)
-->

<!-- routify:options bundle=true -->

<script>
    import { ready, redirect } from '@sveltech/routify'
    import { loading, authenticated, user } from '@oarc/ssd-access/authstore.js'


    /*
     * since SSR normally won't render till all components have been loaded
     * and our <slot /> will never load, we will have to let SSR do its job
     * right away by calling $ready()
     */
    $ready()
</script>

<div class="admin-module" class:not-authed={!$user}>
    {#if !window.routify.inBrowser}
        Hello bot. This page is only available to humans.
    {:else if $loading}
        <div class="center-all">
            <h1>Loading...</h1>
        </div>
    {:else if $authenticated}
        <slot />
    {:else}
        {$redirect('/')}
    {/if}
</div>