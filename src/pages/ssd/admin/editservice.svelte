<!--
    (c) 2020 Open AR Cloud
    This code is licensed under MIT license (see LICENSE.md for details)
-->

<script lang="ts">
    import { url } from '@roxi/routify';

    import { searchServicesForProducer, getServiceWithId, type SSR } from '@oarc/ssd-access';
    import { authStore } from '@oarc/ssd-access/authstore.js';

    import jwtDecode from 'jwt-decode';
    import CountryCode from '../../../components/ssd/CountryCode.svelte';

    // eslint-disable-next-line no-undef
    const providerUrl = import.meta.env['VITE_AUTH0_SSD_PROVIDER'];
    const detailUrl = '../detail';

    let countryCodeElement: CountryCode;
    let serviceId = '';
    let searchResults: SSR[] = [];
    let message = '';

    let producer: any;
    authStore.getToken().then((token) => {
        const decoded: Record<string, unknown> = jwtDecode(token || '');
        producer = decoded[providerUrl];
    });

    function handleSearch() {
        message = '';

        if (!countryCodeElement.checkValidity()) {
            message = 'Please select the Region to search';
            return;
        }

        if (serviceId.length !== 0) {
            getService();
        } else {
            getServicesForProducer();
        }
    }

    function getService() {
        getServiceWithId(countryCodeElement.value(), serviceId)
            .then((service) => {
                searchResults = [];
                searchResults.push(service);
            })
            .catch((error) => {
                message = 'Search failed';
                console.error(`${message}: ${error}`);
            });
    }

    function getServicesForProducer() {
        authStore
            .getToken()
            .then((token) => searchServicesForProducer(countryCodeElement.value(), token || ''))
            .then((services) => {
                searchResults = services;
                if (services.length === 0) message = 'No services found';
            })
            .catch((error) => {
                message = 'Search failed';
                console.error(`${message}: ${error}`);
            });
    }
</script>

<h2>Search Services</h2>
<h3>Producer: {producer}</h3>

<div>
    <CountryCode bind:this={countryCodeElement} />

    <label for="searchserviceid">Service ID:</label>
    <input id="searchserviceid" type="text" bind:value={serviceId} />

    <button on:click={handleSearch}>Search</button>
</div>

{#if searchResults.length > 0}
    <dl id="service-container">
        {#each searchResults as result}
            <dt><a href={$url(detailUrl, { countryCode: countryCodeElement.value(), id: result.id })}>{result.id}</a></dt>
            {#each result.services as service}
                <dd>{service.type}: {service.title}</dd>
            {/each}
        {/each}
    </dl>
{:else}
    {message}
{/if}

<style>
    #service-container {
        border-radius: 20px;
        padding: 20px;
    }
</style>
