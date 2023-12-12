<script lang="ts">
    import { isActive, url } from '@roxi/routify';
    import { authStore as authenticationStore } from '@oarc/scd-access';

    export let links: [string, string, boolean][];
    export let authStore: typeof authenticationStore;
    export let authenticated;
</script>

<nav>
    {#each links as [path, name, needsLogin]}
        {#if $authenticated || !needsLogin}
            <a class:active={$isActive(path)} href={$url(path)}>{name}</a>
        {:else}
            <span class="inactive">{name}</span>
        {/if}
    {/each}

    {#if $authenticated}
        <a class="floatright" href="/" on:click={authStore.logout}>Logout</a>
    {:else}
        <a class="floatright" href="/" on:click={authStore.login}>Login</a>
    {/if}
</nav>

<!--
    (c) 2020 Open AR Cloud
    This code is licensed under MIT license (see LICENSE.md for details)
-->

<style>
    a {
        color: #fff;
        margin-left: 15px;
    }

    a.active {
        color: #ea6237;
    }

    .inactive {
        margin-left: 15px;
    }

    nav {
        margin: -40px 0 40px;
    }
</style>
