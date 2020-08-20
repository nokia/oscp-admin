/*
 * (c) 2020 Open AR Cloud
 * This code is licensed under MIT license (see LICENSE.md for details)
 */

/*
 * (c) 2020 Open AR Cloud
 * This code is licensed under MIT license (see LICENSE.md for details)
 */

import { writable, get } from 'svelte/store'
import createAuth0Client from "@auth0/auth0-spa-js"


const AUTH_CONFIG = {
    domain: __myapp.env["AUTH0_SSD_DOMAIN"],
    client_id: __myapp.env["AUTH0_SSD_CLIENTID"]
}

export const authStore = createAuthStore()

function createAuthStore() {
    const loading = writable(true)
    const authenticated = writable(false)
    const user = writable(null)
    let auth0 = null


    async function init(){
        auth0 = await createAuth0Client(AUTH_CONFIG)

        user.set('user');         // await auth0.getUser())
        loading.set(false)
        authenticated.set(true)
    }

    async function signin() {
        await auth0.loginWithPopup()

        user.set(await auth0.getUser())
        authenticated.set(true)
    }

    async function signout() {
        await auth0.logout()

        user.set(await auth0.getUser())
        authenticated.set(false)
    }

    function isAuthenticated() {
        return get(authenticated);
    }

    return { loading, authenticated, user, auth0, isAuthenticated, signin, signout, init }
}
