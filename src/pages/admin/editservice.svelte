<!--
    (c) 2020 Open AR Cloud
    This code is licensed under MIT license (see LICENSE.md for details)
-->

<script>
    import { url } from '@sveltech/routify';
    import { user } from '../../core/auth.js';

    const detailUrl = '../detail';

    const data = [{
        'provider': 'oscptest',
        'id': '4010b3ff3047877a',
        'services': [{
            "type": "geopose",
            "url": "http://geopose.geo1.example.com",
            "title": "Campus triangle geopose"
        }, {
            "type": "content-discovery",
            "url": "http://content-discovery.geo1.example.com",
            "title": "Campus triangle content discovery"
        }]
    }, {
        'provider': 'oscptest',
        'id': 'b431986c2f1f7477',
        'services': [{
            "type": 'geopose',
            "url": 'http://geopose.geo1.example.com',
            "title": 'Stadium geopose'
        }, {
            "type": 'content-discovery',
            "url": 'http://content-discovery.geo1.example.com',
            "title": 'Stadium content discovery'
        }]
    }];

    let countryCode = 'us';
    let tenant = 'oscptestmv';
    let serviceId = '4010b3ff3047877a';
    let searchResults = [];


    function handleSearch() {
        searchResults = data;
    }
</script>

<style>
    li {
        list-style-type: none;
    }
</style>


<h2>Search Services</h2>

<div>
    <label for="searchcountry">Region</label>
    <input id="searchcountry" type="text" value="{countryCode}">
    <label for="searchtenant">Tenant</label>
    <input id="searchtenant" type="text" value="{tenant}">
    <label for="searchserviceid">Service ID</label>
    <input id="searchserviceid" type="text" value="{serviceId}">
    <button on:click={handleSearch}>Search</button>
</div>

<ul>
{#each searchResults as result}
    {#each result.services as service}
    <li><a href="{$url(detailUrl, {'countryCode': 'us', 'id': result.id})}">{service.title}, {service.type}</a></li>
    {/each}
{/each}
</ul>
