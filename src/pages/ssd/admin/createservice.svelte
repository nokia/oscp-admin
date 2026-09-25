<!--
  (c) 2020 Open AR Cloud, This code is licensed under MIT license (see LICENSE.md for details)
  (c) 2024 Nokia, Licensed under the MIT License, SPDX-License-Identifier: MIT
-->

<script lang="ts">
    import { validateSsr, postService } from '@oarc/ssd-access';
    import { authStore } from '@oarc/ssd-access';

    import { goto } from '@sveltech/routify';

    import Form from '../../../components/Form.svelte';
    import CountryCode from '../../../components/ssd/CountryCode.svelte';
    import SSRComponent from '../../../components/ssd/SSR.svelte';
    import { emptyServiceToCreate, newServiceRegion, newServiceToCreate } from '../../../core/store';

    let form: Form;
    let countryCodeElement: CountryCode;
    let errorMessage = '';
    let formKey = 0;

    function resetCreateForm() {
        errorMessage = '';
        $newServiceRegion = '';
        $newServiceToCreate = emptyServiceToCreate();
        formKey += 1;
    }

    async function save(event: Event) {
        event.preventDefault();

        if (!form.reportValidity()) {
            event.preventDefault();
            errorMessage = 'New SSR not sent - Form invalid';
            return;
        }

        errorMessage = '';
        $newServiceToCreate.timestamp = Date.now();
        const dataString = JSON.stringify($newServiceToCreate);
        try {
            validateSsr(dataString);
            const token = await authStore.getToken();
            await postService(countryCodeElement.value(), dataString, token || '');
            resetCreateForm();
            $goto('/ssd');
        } catch (error) {
            errorMessage = `New SSR not sent - ${error}`;
        }
    }
</script>

<h2>Create Spatial Service Record</h2>

{#key formKey}
    <Form bind:data={$newServiceToCreate} bind:this={form}>
        <p slot="intro">Enter data for new SSR record.</p>

        <div slot="extras">
            <CountryCode bind:selected={$newServiceRegion} bind:this={countryCodeElement} />
        </div>

        <div slot="form">
            <SSRComponent bind:data={$newServiceToCreate} />
        </div>

        <div slot="controls">
            <button on:click={save}>Save</button>
            <button type="button" on:click={resetCreateForm}>Reset</button>
        </div>
    </Form>
{/key}

{#if errorMessage}
    <p class="error" role="alert">{errorMessage}</p>
{/if}

<style>
    .error {
        color: #b00020;
    }
</style>
