<!--
  (c) 2020 Open AR Cloud, This code is licensed under MIT license (see LICENSE.md for details)
  (c) 2024 Nokia, Licensed under the MIT License, SPDX-License-Identifier: MIT
-->

<script lang="ts">
    import { postSsrFile, authStore } from '@oarc/ssd-access';

    import Import from '../../../components/Import.svelte';
    import CountryCode from '../../../components/ssd/CountryCode.svelte';

    let countryCodeElement: CountryCode;
    const propertyMissingMessage = 'Please select the Region to upload to';
    const regionControl = {
        get value() {
            return countryCodeElement ? countryCodeElement.value() : '';
        },
        checkValidity() {
            return countryCodeElement ? countryCodeElement.checkValidity() : false;
        },
    };
</script>

<Import {authStore} {propertyMissingMessage} propertyElement={regionControl} postFileFunction={({ propertyValue, file, token }) => postSsrFile(propertyValue, file, token)}>
    <p slot="intro">
        Here it is possible to upload Spatial Service Records (SSR) by either dropping .json files onto the drop area or by selecting files from drive. The content is validated against a json schema
        and sent to the regional server of the provided region. A protocol of the process is shown below the drop area.
    </p>

    <div slot="search" id="search">
        <CountryCode bind:this={countryCodeElement} />
    </div>
</Import>
