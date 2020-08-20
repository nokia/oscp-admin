<!--
    (c) 2020 Open AR Cloud
    This code is licensed under MIT license (see LICENSE.md for details)
-->

<script>
    import { authStore } from '../core/auth'

    let loginLabel = authStore.isAuthenticated() ? 'Logout' : 'Login';

    async function handleLogin() {
        // await authStore.signin();
    }
</script>

<h2>Welcome</h2>

<p>Sample admin app for the services offered by Open Spatial Computing Platform of Open AR Cloud. The idea is to offer
main functionality available as standard web components, to make it as easy as possible to integrate access to the
services into existing cms already in use by companies.</p>

<button on:click={handleLogin}>{loginLabel}</button>