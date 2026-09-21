/*
  (c) 2020 Open AR Cloud, This code is licensed under MIT license (see LICENSE.md for details)
  (c) 2024 Nokia, Licensed under the MIT License, SPDX-License-Identifier: MIT
*/

/** Local/compose mode: skip Auth0 and treat the user as authenticated. */
export const authDisabled = import.meta.env['VITE_AUTH_DISABLED'] === 'true';

/** Claim value backends use when AUTH_REQUIRED=false. */
export const NO_AUTH_LABEL = 'noauthtest';

type DiscoveryService = 'SSD' | 'SCD';

export function authInitParams(service: DiscoveryService): [string, string, string, string] {
    if (authDisabled) {
        return ['disabled', 'disabled', 'disabled', 'disabled'];
    }

    return [
        import.meta.env[`VITE_AUTH0_${service}_DOMAIN`] ?? '',
        import.meta.env[`VITE_AUTH0_${service}_CLIENTID`] ?? '',
        import.meta.env[`VITE_AUTH0_${service}_AUDIENCE`] ?? '',
        import.meta.env[`VITE_AUTH0_${service}_SCOPE`] ?? '',
    ];
}

/**
 * Pass disabled config straight into the access-library auth store.
 * Auth0 still waits until Routify is in the browser, and marks loading first so
 * admin layouts do not redirect before init finishes.
 */
export function initAuth(
    init: (domain: string, clientId: string, audience: string, scope: string) => Promise<void>,
    service: DiscoveryService,
    setLoading?: (value: boolean) => void,
) {
    const [domain, clientId, audience, scope] = authInitParams(service);

    if (authDisabled) {
        void init(domain, clientId, audience, scope);
        return;
    }

    setLoading?.(true);
    setTimeout(() => {
        if (window.routify?.inBrowser) {
            void init(domain, clientId, audience, scope);
        } else {
            setLoading?.(false);
        }
    });
}
