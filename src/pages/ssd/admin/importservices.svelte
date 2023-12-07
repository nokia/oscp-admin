<!--
    (c) 2020 Open AR Cloud
    This code is licensed under MIT license (see LICENSE.md for details)
-->

<script lang="ts">
    import { postSsrFile, supportedCountries } from '@oarc/ssd-access';
    import { authStore } from '@oarc/ssd-access/authstore.js';

    import Import from '../../../components/Import.svelte';

    let countryCodeElement: HTMLInputElement;
    const propertyMissingMessage = 'Please select the Region to upload to';
</script>

<Import {authStore} {propertyMissingMessage} propertyElement={countryCodeElement} postFileFunction={postSsrFile}>
    <p slot="intro">
        Here it is possible to upload Spatial Service Records (SSR) by either dropping .json files onto the drop area or by selecting files from drive. The content is validated against a json schema
        and sent to the regional server of the provided region. A protocol of the process is shown below the drop area.
    </p>

    <div slot="search" id="search">
        <label for="searchcountry">Region</label>
        <input id="searchcountry" type="text" required list="supported-countries" bind:this={countryCodeElement} />
    </div>
</Import>

{@html supportedCountries}
