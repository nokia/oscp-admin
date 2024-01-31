<!--
  (c) 2020 Open AR Cloud, This code is licensed under MIT license (see LICENSE.md for details)
  (c) 2024 Nokia, Licensed under the MIT License, SPDX-License-Identifier: MIT
-->

<script lang="ts">
    import { supportedCountries } from '@oarc/ssd-access';

    let countryCodeElement: HTMLInputElement;

    export function value() {
        return countryCodeElement.value;
    }

    export function checkValidity() {
        return countryCodeElement.checkValidity();
    }
</script>

<label for="countrycode">Region</label>
<input id="countrycode" required bind:this={countryCodeElement} list="supported-countries" />

{@html supportedCountries}
