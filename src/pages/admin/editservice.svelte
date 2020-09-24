<!--
    (c) 2020 Open AR Cloud
    This code is licensed under MIT license (see LICENSE.md for details)
-->

<script>
    import { url } from '@sveltech/routify';

    import { searchServicesForTenant, getServiceWithId, supportedCountries } from 'ssd-access';
    import { authStore } from 'ssd-access/authstore.js'

    import jwtDecode from 'jwt-decode';


    const detailUrl = '../detail';
    const providerUrl = 'https://ssd.oscp.cloudpose.io/provider';

    let countryCodeElement;
    let serviceId = '';
    let searchResults = [];
    let message = '';

    let tenant;
    authStore.getToken().then(token => {
        const decoded = jwtDecode(token);
        tenant = decoded[providerUrl];
    });


    function handleSearch() {
        message = '';

        if(!countryCodeElement.checkValidity()) {
            message = 'Please select the Region to search';
            return;
        }

        if (serviceId.length !== 0) {
            getService();
        } else {
            getServicesForTenant()
        }
    }

    function getService() {
        getServiceWithId(countryCodeElement.value, serviceId)
            .then(service => {
                searchResults = [];
                searchResults.push(service)
            })
            .catch(error => {
                message = 'Search failed';
                console.error(`${message}: ${error}`);
            });
    }

    function getServicesForTenant() {
        authStore.getToken()
            .then(token => searchServicesForTenant(countryCodeElement.value, token))
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

<style>
    #service-container {
        border-radius: 20px;
        padding: 20px;
    }

    #searchcountry:invalid {
        border: 2px solid red;
    }
</style>


<h2>Search Services</h2>
<h3>Tenant: ${tenant}</h3>

<div>
    <label for="searchcountry">Region:</label>
    <input id="searchcountry" type="text" required list="supported-countries" bind:this={countryCodeElement} />

    <label for="searchserviceid">Service ID:</label>
    <input id="searchserviceid" type="text" bind:value="{serviceId}" />

    <button on:click={handleSearch}>Search</button>
</div>

{#if searchResults.length > 0}
<dl id="service-container">
{#each searchResults as result}
    <dt><a href="{$url(detailUrl, {'countryCode': countryCodeElement.value, 'id': result.id})}">{result.id}</a></dt>
    {#each result.services as service}
    <dd>{service.type}: {service.title}</dd>
    {/each}
{/each}
</dl>
{:else}
    {message}
{/if}

{@html supportedCountries}
