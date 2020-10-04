<!--
    (c) 2020 Open AR Cloud
    This code is licensed under MIT license (see LICENSE.md for details)
-->

<style>
    #service-container {
        border-radius: 20px;
        padding: 20px;
    }
</style>

<script>
    import { url } from '@sveltech/routify';

    import { searchServicesForTenant, getServiceWithId } from 'scd-access';
    import { authStore } from 'scd-access/authstore.js'

    import jwtDecode from 'jwt-decode';
    import Topic from '../../../components/scd/Topic.svelte';

    // eslint-disable-next-line no-undef
    const tenantUrl = oscp_app.env["AUTH0_SCD_TENANT"];
    const detailUrl = '../detail';

    let topicElement;
    let serviceId = '';
    let searchResults = [];
    let message = '';

    let tenant;
    authStore.getToken().then(token => {
        const decoded = jwtDecode(token);
        tenant = decoded[tenantUrl];
    });

    function handleSearch() {
        message = '';

        if (!topicElement.checkValidity()) {
            message = 'Please enter a topic for search';
            return;
        }

        if (serviceId.length !== 0) {
            getService();
        } else {
            getServicesForProducer()
        }
    }

    function getService() {
        getServiceWithId(topicElement.value(), serviceId)
            .then(service => {
                searchResults = [];
                searchResults.push(service)
            })
            .catch(error => {
                message = 'Search failed';
                console.error(`${message}: ${error}`);
            });
    }

    function getServicesForProducer() {
        authStore.getToken()
            .then(token => searchServicesForTenant(topicElement.value(), token))
            .then(services => {
                searchResults = services
                if (services.length === 0) message = 'No services found';
            })
            .catch(error => {
                message = 'Search failed';
                console.error(`${message}: ${error}`);
            });
    }
</script>


<h2>Search Services</h2>
<h3>Tenant: {tenant}</h3>

<div>
    <Topic bind:this={topicElement} />

    <label for="searchserviceid">Service ID:</label>
    <input id="searchserviceid" type="text" bind:value="{serviceId}" />

    <button on:click={handleSearch}>Search</button>
</div>

{#if searchResults.length > 0}
    <dl id="service-container">
        {#each searchResults as result}
            <dt><a href="{$url(detailUrl, {'topic': topicElement.value(), 'id': result.id})}">{result.id}</a></dt>
            <dd>{result.content.title}: {result.content.type}</dd>
        {/each}
    </dl>
{:else}
    {message}
{/if}
