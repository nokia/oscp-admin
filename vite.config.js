/*
  (c) 2020 Open AR Cloud, This code is licensed under MIT license (see LICENSE.md for details)
  (c) 2024 Nokia, Licensed under the MIT License, SPDX-License-Identifier: MIT
*/

import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import basicSsl from '@vitejs/plugin-basic-ssl';
import { routify } from '@sveltech/routify';
import typescript from '@rollup/plugin-typescript';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [svelte(), basicSsl(), routify({ dynamicImports: true }), typescript()],
    optimizeDeps: {
        exclude: ['@sveltech/routify'],
    },
});
