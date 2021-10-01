<!--
    (c) 2020 Open AR Cloud
    This code is licensed under MIT license (see LICENSE.md for details)
-->

<script>
    import { authStore } from '@oarc/scd-access/authstore.js'

    // need to queue init till after Routify has been initialized
    setTimeout(() => window.routify.inBrowser && authStore.init())
</script>


<h2>Spatial Content Discovery</h2>

<p>
    General information about SCD upcoming.
</p>