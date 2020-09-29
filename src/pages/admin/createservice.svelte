<!--
    (c) 2020 Open AR Cloud
    This code is licensed under MIT license (see LICENSE.md for details)
-->

<script>
    import { ssr_empty, validateSsr, postService } from 'ssd-access';
    import { authStore } from 'ssd-access/authstore.js'

    import { goto } from '@sveltech/routify';

    import Form from '../../components/Form.svelte';
    import CountryCode from '../../components/CountryCode.svelte';


    let form;
    let countryCodeElement;
    let data = ssr_empty;

    function save(event) {
        event.preventDefault();

        console.log(`create: ${JSON.stringify(data)}`);

        if (!form.reportValidity()) {
            event.preventDefault();
            console.log(`New SSR not sent - Form invalid`);

            return;
        }

        const dataString = JSON.stringify(data);
        validateSsr(dataString)
            .then(() => authStore.getToken())
            .then(token => postService(countryCodeElement.value(), dataString, token))
            .then((response) => {
                console.log(response);
                $goto('/');
            })
            .catch(error => {
                console.log(`New SSR not sent - ${error}`);
            });
    }
</script>


<Form bind:data bind:this={form}>
    <p slot="intro">Enter data for new SSR record.</p>

    <div slot="extras">
        <CountryCode bind:this={countryCodeElement} />
    </div>

    <div slot="controls">
        <button on:click={save}>Save</button>
        <button type="reset">Reset</button>
    </div>
</Form>
