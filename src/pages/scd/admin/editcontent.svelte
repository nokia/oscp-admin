<!--
  (c) 2020 Open AR Cloud, This code is licensed under MIT license (see LICENSE.md for details)
  (c) 2024 Nokia, Licensed under the MIT License, SPDX-License-Identifier: MIT
-->

<script lang="ts">
    import { url } from '@sveltech/routify';

    import { authStore, searchContentsForTenant, getContentWithId, type SCR } from '@oarc/scd-access';
    import { oscpScdUrl } from '../../../core/store';

    import jwtDecode from 'jwt-decode';
    import Topic from '../../../components/scd/Topic.svelte';

    // eslint-disable-next-line no-undef
    const tenantUrl = import.meta.env['VITE_AUTH0_SCD_TENANT'];
    const detailUrl = '../detail';

    let topicElement: Topic;
    let contentId = '';
    let searchResults: SCR[] = [];
    let message = '';

    let tenant: any;
    authStore.getToken().then((token) => {
        const decoded = jwtDecode<Record<string, any>>(token || '');
        tenant = decoded[tenantUrl];
    });

    function handleSearch() {
        message = '';

        if (!topicElement.checkValidity()) {
            message = 'Please enter a topic for search';
            return;
        }

        if (contentId.length !== 0) {
            getContent();
        } else {
            getContentsForTenant();
        }
    }

    function getContent() {
        getContentWithId($oscpScdUrl, topicElement.value(), contentId)
            .then((content) => {
                searchResults = [];
                searchResults.push(content);
            })
            .catch((error) => {
                message = 'Search failed';
                console.error(`${message}: ${error}`);
            });
    }

    function getContentsForTenant() {
        authStore
            .getToken()
            .then((token) => searchContentsForTenant($oscpScdUrl, topicElement.value(), token || ''))
            .then((contents) => {
                searchResults = contents;
                if (contents.length === 0) message = 'No contents found';
            })
            .catch((error) => {
                message = 'Search failed';
                console.error(`${message}: ${error}`);
            });
    }
</script>

<h2>Search Contents</h2>
<h3>Tenant: {tenant}</h3>

<div>
    <Topic bind:this={topicElement} />

    <label for="searchcontentid">Content ID:</label>
    <input id="searchcontentid" type="text" bind:value={contentId} />

    <button on:click={handleSearch}>Search</button>
</div>

{#if searchResults.length > 0}
    <dl id="result-container">
        {#each searchResults as result}
            <dt><a href={$url(detailUrl, { topic: topicElement.value(), id: result.id })}>{result.id}</a></dt>
            <dd>{result.content.title}: {result.content.type}</dd>
        {/each}
    </dl>
{:else}
    {message}
{/if}

<!--
    (c) 2020 Open AR Cloud
    This code is licensed under MIT license (see LICENSE.md for details)
-->

<style>
    #result-container {
        border-radius: 20px;
        padding: 20px;
    }
</style>
