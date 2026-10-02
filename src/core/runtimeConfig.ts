/*
  (c) 2020 Open AR Cloud, This code is licensed under MIT license (see LICENSE.md for details)
  (c) 2024 Nokia, Licensed under the MIT License, SPDX-License-Identifier: MIT
*/

/**
 * Runtime overlay for Docker. `public/config.js` sets `window.__OSCP_CONFIG__`
 * before the bundle loads. `npm run dev` leaves that object empty and uses
 * Vite `VITE_*` values from `.env`.
 */
const RUNTIME_ALIASES: Record<string, string> = {
    VITE_OSCP_SSD_URL: 'OSCP_SSD_URL',
    VITE_OSCP_SCD_URL: 'OSCP_SCD_URL',
    VITE_AUTH_DISABLED: 'AUTH_DISABLED',
};

export function env(key: string): string {
    const runtime = typeof window !== 'undefined' ? window.__OSCP_CONFIG__ : undefined;
    if (runtime) {
        const direct = runtime[key];
        if (direct != null && String(direct) !== '') {
            return String(direct);
        }
        const alias = RUNTIME_ALIASES[key];
        if (alias) {
            const aliased = runtime[alias];
            if (aliased != null && String(aliased) !== '') {
                return String(aliased);
            }
        }
    }

    const baked = import.meta.env[key];
    return typeof baked === 'string' ? baked : '';
}

export function envFlag(key: string): boolean {
    return ['true', '1', 'yes', 'on'].includes(env(key).toLowerCase());
}
