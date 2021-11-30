<!--
    (c) 2020 Open AR Cloud
    This code is licensed under MIT license (see LICENSE.md for details)
-->

<script>
    import { authStore } from '@oarc/scd-access/authstore.js'

    let auth_domain = oscp_app.env["AUTH0_SCD_DOMAIN"]
    let auth_client_id = oscp_app.env["AUTH0_SCD_CLIENTID"]
    let auth_audience = oscp_app.env["AUTH0_SCD_AUDIENCE"]
    let auth_scope = oscp_app.env["AUTH0_SCD_SCOPE"]
    // need to queue init till after Routify has been initialized
    setTimeout(() => window.routify.inBrowser && authStore.init(auth_domain, auth_client_id, auth_audience, auth_scope))
</script>


<h2>Spatial Content Discovery</h2>

<p>
    General information about SCD upcoming.
</p>