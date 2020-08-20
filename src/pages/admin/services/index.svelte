<!--
    (c) 2020 Open AR Cloud
    This code is licensed under MIT license (see LICENSE.md for details)
-->

<script>
    import { url, goto } from "@sveltech/routify";

    const detailUrl = '../detail'

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
            "type": "geopose",
            "url": "http://geopose.geo1.example.com",
            "title": "Stadium geopose"
        }, {
            "type": "content-discovery",
            "url": "http://content-discovery.geo1.example.com",
            "title": "Stadium content discovery"
        }]
    }]

    const countryCode = 'us'
    let searchResults = []


    function handleNewService() {
        $goto(detailUrl);
    }

    function handleSearch() {
        searchResults = data
    }
</script>

<h2>Spatial Service Discovery</h2>

<div>
    <label for="searchcountry">Region</label>
    <input id="searchcountry" type="text" value="US">
    <button on:click={handleSearch}>Search</button>
</div>

<dl>
<dt>Provider: oscptest, Country: US</dt>
{#each searchResults as result}
    {#each result.services as service}
    <dd><a href="{$url(detailUrl, {'countryCode': 'us', 'id': result.id})}">{service.title}, {service.type}</a></dd>
    {/each}
{/each}
</dl>

<button on:click={handleNewService}>New</button>