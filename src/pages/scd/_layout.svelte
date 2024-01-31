<!--
  (c) 2020 Open AR Cloud, This code is licensed under MIT license (see LICENSE.md for details)
  (c) 2024 Nokia, Licensed under the MIT License, SPDX-License-Identifier: MIT
-->

<!-- routify:options bundle=true -->

<script lang="ts">
    import { authStore, authenticated } from '@oarc/scd-access';

    import Navigation from '../../components/Navigation.svelte';

    const links: [string, string, boolean][] = [
        ['/scd/', 'Home', false],
        ['/scd/admin/createcontent', 'Create', true],
        ['/scd/admin/editcontent', 'Edit', true],
        ['/scd/admin/importcontents', 'Import', true],
    ];
</script>

<Navigation {links} {authStore} {authenticated} />

<slot />
