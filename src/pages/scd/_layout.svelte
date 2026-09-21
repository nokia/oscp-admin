<!--
  (c) 2020 Open AR Cloud, This code is licensed under MIT license (see LICENSE.md for details)
  (c) 2024 Nokia, Licensed under the MIT License, SPDX-License-Identifier: MIT
-->

<!-- routify:options bundle=true -->

<script lang="ts">
    import { authStore, authenticated, loading } from '@oarc/scd-access';
    import { oscpScdUrl } from '../../core/store';
    import { initAuth } from '../../core/authMode';

    import Navigation from '../../components/Navigation.svelte';

    $oscpScdUrl = import.meta.env['VITE_OSCP_SCD_URL'] ?? '';
    initAuth(authStore.init, 'SCD', (value) => loading.set(value));

    const links: [string, string, boolean][] = [
        ['/scd/', 'Home', false],
        ['/scd/admin/createcontent', 'Create', true],
        ['/scd/admin/editcontent', 'Edit', true],
        ['/scd/admin/importcontents', 'Import', true],
    ];
</script>

<Navigation {links} {authStore} {authenticated} />

<slot />
