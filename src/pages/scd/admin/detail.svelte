<!--
  (c) 2020 Open AR Cloud, This code is licensed under MIT license (see LICENSE.md for details)
  (c) 2024 Nokia, Licensed under the MIT License, SPDX-License-Identifier: MIT
-->

<script lang="ts">
    import { onMount } from 'svelte';
    import { url, route, params, goto } from '@sveltech/routify';

    import { authStore, getContentWithId, deleteWithId, putContent, type SCR } from '@oarc/scd-access';
    import { oscpScdUrl } from '../../../core/store';

    import Form from '../../../components/Form.svelte';
    import SCRComponent from '../../../components/scd/SCR.svelte';

    import { CheveronLeftIcon } from 'svelte-zondicons';
    import type { MouseEventHandler } from 'svelte/elements';

    let data: SCR | undefined;
    let errorMessage = '';
    let returnPath = ($route as any).last ? `${($route as any).last.path}?${new URLSearchParams(($route as any).last.params)}` : '/scd/admin/editcontent';

    onMount(() => {
        getContentWithId($oscpScdUrl, $params.topic, $params.id)
            .then((contents) => (data = contents))
            .catch((error) => {
                errorMessage = `Server access error: ${error}`;
            });
    });

    async function handleDelete() {
        if (!confirm('Delete this content record?')) {
            return;
        }

        errorMessage = '';
        try {
            const token = await authStore.getToken();
            await deleteWithId($oscpScdUrl, $params.topic, $params.id, token || '');
            $goto(returnPath);
        } catch (error) {
            errorMessage = `Failed to delete: ${error}`;
        }
    }

    const handleSave: MouseEventHandler<HTMLButtonElement> = async (event) => {
        event.preventDefault();

        if (data) {
            errorMessage = '';
            try {
                const token = await authStore.getToken();
                data.timestamp = Date.now();
                await putContent($oscpScdUrl, $params.topic, data, data.id, token || '');
                $goto(returnPath);
            } catch (error) {
                errorMessage = `Content record not saved: ${error}`;
            }
        }
    };
    const urlReturnPath = (): any => {
        return $url(returnPath);
    };
</script>

<h2>
    <a href={urlReturnPath()}>
        <CheveronLeftIcon />
    </a>
    <span>SCR record detail</span>
</h2>

{#if data}
    <Form {data}>
        <p slot="intro">Edit SCR record.</p>

        <div slot="form">
            <SCRComponent bind:data />
        </div>

        <div slot="controls">
            <button on:click={handleSave}>Save</button>
        </div>
    </Form>

    {#if errorMessage}
        <p class="error" role="alert">{errorMessage}</p>
    {/if}

    <button on:click={handleDelete}>Delete</button>
{:else if errorMessage}
    <p class="error" role="alert">{errorMessage}</p>
{/if}

<style>
    .error {
        color: #b00020;
    }
</style>
