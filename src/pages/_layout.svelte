<!--
  (c) 2020 Open AR Cloud, This code is licensed under MIT license (see LICENSE.md for details)
  (c) 2024 Nokia, Licensed under the MIT License, SPDX-License-Identifier: MIT
-->

<header>
    <h1><img id="oarc_logo" src="/OARC_Logo_without_BG.png" alt="Open AR Cloud header" /></h1>
</header>

<main>
    <slot />
</main>

<!-- routify:options bundle=true -->

<style>
    header {
        padding: 3rem;
        background: linear-gradient(180deg, #000, #09374b 67%, #1b5f7c), linear-gradient(180deg, transparent, transparent);
    }

    main {
        padding: 8px;
    }

    #oarc_logo {
        width: auto;
        max-width: 100%;
        max-height: 51px;
    }
</style>
