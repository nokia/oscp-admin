<!--
    (c) 2020 Open AR Cloud
    This code is licensed under MIT license (see LICENSE.md for details)
-->

<!-- routify:options bundle=true -->

<script>
    import { authStore, authenticated } from '@oarc/scd-access/authstore.js';

    import Navigation from '../../components/Navigation.svelte';

    const links = [
            ['/scd/', 'Home', false],
            ['/scd/admin/createservice', 'Create', true],
            ['/scd/admin/editservice', 'Edit', true],
            ['/scd/admin/importservices', 'Import', true]
        ]
</script>

<Navigation {links} {authStore} {authenticated} />

<slot/>
