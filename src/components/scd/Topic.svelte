<!--
  (c) 2020 Open AR Cloud, This code is licensed under MIT license (see LICENSE.md for details)
  (c) 2024 Nokia, Licensed under the MIT License, SPDX-License-Identifier: MIT
-->

<script lang="ts">
    import { getSupportedTopics } from '@oarc/scd-access';
    import { oscpScdUrl, topicName } from '../../core/store';

    let topicElement: HTMLSelectElement;
    let topics: string[] = [];
    let loadError = '';
    let loadedFor = '';

    export function value() {
        return topicElement.value;
    }

    export function checkValidity() {
        return topicElement.checkValidity();
    }

    async function loadTopics(url: string) {
        if (!url || url === loadedFor) {
            return;
        }
        loadedFor = url;
        loadError = '';
        try {
            const loaded = await getSupportedTopics(url);
            topics = [...loaded].sort((a, b) => a.localeCompare(b));
            const current = $topicName.trim().toLowerCase();
            if (current && topics.includes(current)) {
                $topicName = current;
            } else if (current) {
                $topicName = '';
            }
        } catch (error) {
            loadedFor = '';
            topics = [];
            loadError = `Could not load topics: ${error}`;
        }
    }

    $: loadTopics($oscpScdUrl);
</script>

<label for="topic">Topic</label>
<select id="topic" required bind:this={topicElement} bind:value={$topicName}>
    <option value="" disabled>
        {loadError ? 'Topics unavailable' : topics.length === 0 ? 'Loading topics…' : 'Select a topic'}
    </option>
    {#each topics as topic}
        <option value={topic}>{topic}</option>
    {/each}
</select>
{#if loadError}
    <p class="topic-error">{loadError}</p>
{/if}

<style>
    .topic-error {
        color: #a40000;
    }
</style>
