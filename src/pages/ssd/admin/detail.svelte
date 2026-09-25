<!--
  (c) 2020 Open AR Cloud, This code is licensed under MIT license (see LICENSE.md for details)
  (c) 2024 Nokia, Licensed under the MIT License, SPDX-License-Identifier: MIT
-->

<script lang="ts">
    import { onMount } from 'svelte';
    import { url, route, params, goto } from '@sveltech/routify';

    import { ssr_empty, authStore, getServiceWithId, deleteWithId, validateSsr, putService, type SSR } from '@oarc/ssd-access';

    import Form from '../../../components/Form.svelte';
    import SSRComponent from '../../../components/ssd/SSR.svelte';
    import type { MouseEventHandler } from 'svelte/elements';

    let data: SSR = ssr_empty;
    let errorMessage = '';
    let returnPath = ($route as any).last ? `${($route as any).last.path}?${new URLSearchParams(($route as any).last.params)}` : '/ssd/admin/editservice';

    onMount(() => {
        getServiceWithId($params.countryCode, $params.id)
            .then((services) => (data = services))
            .catch((error) => {
                errorMessage = `Server access error: ${error}`;
            });
    });

    async function handleDelete() {
        if (!confirm('Delete this service record?')) {
            return;
        }

        errorMessage = '';
        try {
            const token = await authStore.getToken();
            await deleteWithId($params.countryCode, $params.id, token || '');
            $goto(returnPath);
        } catch (error) {
            errorMessage = `Failed to delete: ${error}`;
        }
    }

    const urlReturnPath = (): any => {
        return $url(returnPath);
    };

    const handleSave: MouseEventHandler<HTMLButtonElement> = async (event) => {
        event.preventDefault();
        errorMessage = '';

        try {
            data.timestamp = Date.now();
            data.active = data.active ?? true;
            const dataString = JSON.stringify(data);
            validateSsr(dataString);
            const token = await authStore.getToken();
            await putService($params.countryCode, dataString, data.id, token || '');
            $goto(returnPath);
        } catch (error) {
            errorMessage = `Service record not saved: ${error}`;
        }
    };
</script>

<h2>
    <a href={urlReturnPath()}><img class="backarrow" alt="back navigation arrow" src="/arrow_back_ios-24px.svg" /></a>
    <span>SSR record detail</span>
</h2>

<Form {data}>
    <p slot="intro">Edit SSR record.</p>

    <div slot="form">
        <SSRComponent bind:data />
    </div>

    <div slot="controls">
        <button on:click={handleSave}>Save</button>
    </div>
</Form>

{#if errorMessage}
    <p class="error" role="alert">{errorMessage}</p>
{/if}

<button on:click={handleDelete}>Delete</button>

<style>
    .error {
        color: #b00020;
    }
</style>
