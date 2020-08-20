<!--
    (c) 2020 Open AR Cloud
    This code is licensed under MIT license (see LICENSE.md for details)
-->

<script>
    import { isActive, url } from "@sveltech/routify";
    import { authStore } from '../core/auth';


    const links = [
            ['/index', 'Home', false],
            ['/admin/services', 'Services', true],
            ['/admin/content', 'Content', true],
        ]
</script>

<style>
    header {
        padding: 6vw;
        background: linear-gradient(180deg,#000,#09374b 67%,#1b5f7c),
        linear-gradient(180deg,transparent,transparent);
    }

    main {
        padding: 8px;
    }

    a {
        color: #fff;
        margin-right: 15px;
    }

    a.active {
        color: #ea6237;
    }

    #oarc_logo {
        width: auto;
        max-width: 100%;
        max-height: 51px;
    }

    span.inactive {
        margin-right: 15px;
    }
</style>

<header>
    <h1><img id="oarc_logo" src="/OARC_Logo_without_BG.png" alt="Open AR Cloud header image"/></h1>

    <nav>
        {#each links as [path, name, needsLogin]}
            {#if authStore.isAuthenticated() || !needsLogin}
            <a class:active={$isActive(path)} href={$url(path)}>{name}</a>
            {:else}
            <span class="inactive">{name}</span>
            {/if}
        {/each}
    </nav>
</header>

<main>
    <slot/>
</main>