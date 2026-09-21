<!--
  (c) 2020 Open AR Cloud, This code is licensed under MIT license (see LICENSE.md for details)
  (c) 2024 Nokia, Licensed under the MIT License, SPDX-License-Identifier: MIT
-->

<script lang="ts">
    import { ssr_empty, validateSsr, postService } from '@oarc/ssd-access';
    import { authStore } from '@oarc/ssd-access';

    import { goto } from '@sveltech/routify';

    import Form from '../../../components/Form.svelte';
    import CountryCode from '../../../components/ssd/CountryCode.svelte';
    import SSRComponent from '../../../components/ssd/SSR.svelte';
    import type { SSR } from '@oarc/ssd-access';

    let form: Form;
    let countryCodeElement: CountryCode;
    let data: SSR = JSON.parse(JSON.stringify(ssr_empty));
    let errorMessage = '';

    async function save(event: Event) {
        event.preventDefault();

        if (!form.reportValidity()) {
            event.preventDefault();
            errorMessage = 'New SSR not sent - Form invalid';
            return;
        }

        errorMessage = '';
        data.timestamp = Date.now();
        const dataString = JSON.stringify(data);
        try {
            validateSsr(dataString);
            const token = await authStore.getToken();
            await postService(countryCodeElement.value(), dataString, token || '');
            $goto('/ssd');
        } catch (error) {
            errorMessage = `New SSR not sent - ${error}`;
        }
    }
</script>

<h2>Create Spatial Service Record</h2>

<Form bind:data bind:this={form}>
    <p slot="intro">Enter data for new SSR record.</p>

    <div slot="extras">
        <CountryCode bind:this={countryCodeElement} />
    </div>

    <div slot="form">
        <SSRComponent bind:data />
    </div>

    <div slot="controls">
        <button on:click={save}>Save</button>
        <button type="reset">Reset</button>
    </div>
</Form>

{#if errorMessage}
    <p class="error" role="alert">{errorMessage}</p>
{/if}

<style>
    .error {
        color: #b00020;
    }
</style>
