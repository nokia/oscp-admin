<!--
  (c) 2020 Open AR Cloud, This code is licensed under MIT license (see LICENSE.md for details)
  (c) 2024 Nokia, Licensed under the MIT License, SPDX-License-Identifier: MIT
-->

<script>
    import { setSsdUrl, authStore } from '@oarc/ssd-access';
    import { oscpSsdUrl } from '../../core/store';

    $oscpSsdUrl = import.meta.env['VITE_OSCP_SSD_URL'];
    setSsdUrl($oscpSsdUrl);

    let auth_domain = import.meta.env['VITE_AUTH0_SSD_DOMAIN'];
    let auth_client_id = import.meta.env['VITE_AUTH0_SSD_CLIENTID'];
    let auth_audience = import.meta.env['VITE_AUTH0_SSD_AUDIENCE'];
    let auth_scope = import.meta.env['VITE_AUTH0_SSD_SCOPE'];
    // need to queue init till after Routify has been initialized
    setTimeout(() => window.routify.inBrowser && authStore.init(auth_domain, auth_client_id, auth_audience, auth_scope));
</script>

<h2>Spatial Service Discovery</h2>

<p>General information about SSD upcoming.</p>
