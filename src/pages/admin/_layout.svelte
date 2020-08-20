<script>
    import { ready, redirect } from '@sveltech/routify'
    import { authStore } from '../../core/auth.js'

    const { user, authenticated, loading } = authStore

    console.log($user);

    /**
     * since SSR normally won't render till all components have been loaded
     * and our <slot /> will never load, we will have to let SSR do its job
     * right away by calling $ready()
     **/
    $ready()
</script>

<div class="admin-module" class:not-authed={!$user}>
    {#if !window.routify.inBrowser}
        Hello bot. This page is only available to humans.
    {:else if $loading}
        <div class="center-all">
            <h1>Loading...</h1>
        </div>
    {:else if $user}
        <slot />
    {:else}
        {$redirect('/')}
    {/if}
</div>