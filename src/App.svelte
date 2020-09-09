<!--
  (c) 2020 Open AR Cloud
  This code is licensed under MIT license (see LICENSE.md for details)
-->

<script>
	import { Router } from "@sveltech/routify";
	import { routes } from "@sveltech/routify/tmp/routes";
    import { authStore } from 'ssd-access/authstore.js'

    // need to queue init till after Routify has been initialized
    setTimeout(() => window.routify.inBrowser && authStore.init())</script>

<Router {routes} />