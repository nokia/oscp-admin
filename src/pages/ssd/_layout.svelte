<!--
  (c) 2020 Open AR Cloud, This code is licensed under MIT license (see LICENSE.md for details)
  (c) 2024 Nokia, Licensed under the MIT License, SPDX-License-Identifier: MIT
-->

<!-- routify:options bundle=true -->

<script lang="ts">
    import { setSsdUrl, authStore, authenticated, loading } from '@oarc/ssd-access';
    import { oscpSsdUrl } from '../../core/store';
    import { initAuth } from '../../core/authMode';

    import Navigation from '../../components/Navigation.svelte';

    $oscpSsdUrl = import.meta.env['VITE_OSCP_SSD_URL'] ?? '';
    setSsdUrl($oscpSsdUrl);
    initAuth(authStore.init, 'SSD', (value) => loading.set(value));

    const links: [string, string, boolean][] = [
        ['/ssd/', 'Home', false],
        ['/ssd/admin/createservice', 'Create', true],
        ['/ssd/admin/editservice', 'Edit', true],
        ['/ssd/admin/importservices', 'Import', true],
    ];
</script>

<Navigation {links} {authStore} {authenticated} />

<slot />
