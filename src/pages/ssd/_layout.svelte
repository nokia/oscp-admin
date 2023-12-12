<!--
    (c) 2020 Open AR Cloud
    This code is licensed under MIT license (see LICENSE.md for details)
-->

<!-- routify:options bundle=true -->

<script lang="ts">
    import { authStore, authenticated } from '@oarc/ssd-access';

    import Navigation from '../../components/Navigation.svelte';

    const links: [string, string, boolean][] = [
        ['/ssd/', 'Home', false],
        ['/ssd/admin/createservice', 'Create', true],
        ['/ssd/admin/editservice', 'Edit', true],
        ['/ssd/admin/importservices', 'Import', true],
    ];
</script>

<Navigation {links} {authStore} {authenticated} />

<slot />
