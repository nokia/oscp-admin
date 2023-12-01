<!--
    (c) 2020 Open AR Cloud
    This code is licensed under MIT license (see LICENSE.md for details)
-->

<script>
    import { supportedCountries } from '@oarc/ssd-access';

    let countryCodeElement;

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
