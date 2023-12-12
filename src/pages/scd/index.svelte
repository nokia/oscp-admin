<!--
    (c) 2020 Open AR Cloud
    This code is licensed under MIT license (see LICENSE.md for details)
-->

<script lang="ts">
    import { authStore } from '@oarc/scd-access';
    import { oscpScdUrl } from '../../core/store';

    $oscpScdUrl = import.meta.env['VITE_OSCP_SCD_URL'];

    let auth_domain = import.meta.env['VITE_AUTH0_SCD_DOMAIN'];
    let auth_client_id = import.meta.env['VITE_AUTH0_SCD_CLIENTID'];
    let auth_audience = import.meta.env['VITE_AUTH0_SCD_AUDIENCE'];
    let auth_scope = import.meta.env['VITE_AUTH0_SCD_SCOPE'];

    // need to queue init till after Routify has been initialized
    setTimeout(() => (window as any).routify.inBrowser && authStore.init(auth_domain, auth_client_id, auth_audience, auth_scope));
</script>

<h2>Spatial Content Discovery</h2>

<p>General information about SCD upcoming.</p>
