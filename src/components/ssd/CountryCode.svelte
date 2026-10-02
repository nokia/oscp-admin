<!--
  (c) 2020 Open AR Cloud, This code is licensed under MIT license (see LICENSE.md for details)
  (c) 2024 Nokia, Licensed under the MIT License, SPDX-License-Identifier: MIT
-->

<script lang="ts">
    import { onMount } from 'svelte';
    import { getSupportedCountries } from '@oarc/ssd-access';

    /** When set, ask this SSD. Otherwise the URL from setSsdUrl is used. */
    export let baseUrl: string | undefined = undefined;

    let countryCodeElement: HTMLSelectElement;
    let countries: string[] = [];
    let loadError = '';

    export let selected = '';

    export function value() {
        return countryCodeElement.value;
    }

    export function checkValidity() {
        return countryCodeElement.checkValidity();
    }

    onMount(async () => {
        try {
            const loaded = await getSupportedCountries(baseUrl);
            countries = [...loaded].sort((a, b) => a.localeCompare(b));
        } catch (error) {
            loadError = `Could not load regions: ${error}`;
        }
    });
</script>

<label for="countrycode">Region</label>
<select id="countrycode" required bind:this={countryCodeElement} bind:value={selected}>
    <option value="" disabled>
        {loadError ? 'Regions unavailable' : countries.length === 0 ? 'Loading regions…' : 'Select a region'}
    </option>
    {#each countries as country}
        <option value={country}>{country}</option>
    {/each}
</select>
{#if loadError}
    <p class="region-error">{loadError}</p>
{/if}

<style>
    .region-error {
        color: #a40000;
    }
</style>
