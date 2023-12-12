<!--
    (c) 2020 Open AR Cloud
    This code is licensed under MIT license (see LICENSE.md for details)
-->

<script lang="ts">
    import { ssr_empty, validateSsr, postService } from '@oarc/ssd-access';
    import { authStore } from '@oarc/ssd-access';

    import { goto } from '@roxi/routify';

    import Form from '../../../components/Form.svelte';
    import CountryCode from '../../../components/ssd/CountryCode.svelte';
    import SSRComponent from '../../../components/ssd/SSR.svelte';
    import type { SSR } from '@oarc/ssd-access';

    let form: Form;
    let countryCodeElement: CountryCode;
    let data: SSR = JSON.parse(JSON.stringify(ssr_empty));

    function save(event: Event) {
        event.preventDefault();

        if (!form.reportValidity()) {
            event.preventDefault();
            console.log(`New SSR not sent - Form invalid`);

            return;
        }

        const dataString = JSON.stringify(data);
        validateSsr(dataString);
        authStore
            .getToken()
            .then((token) => postService(countryCodeElement.value(), dataString, token || ''))
            .then((response) => {
                console.log(response);
                $goto('/ssd');
            })
            .catch((error) => {
                console.log(`New SSR not sent - ${error}`);
            });
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
