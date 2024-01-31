<!--
  (c) 2020 Open AR Cloud, This code is licensed under MIT license (see LICENSE.md for details)
  (c) 2024 Nokia, Licensed under the MIT License, SPDX-License-Identifier: MIT
-->

<script lang="ts">
    import { topicName } from '../../core/store';

    let topicElement: HTMLInputElement;

    export function value() {
        return topicElement.value;
    }

    export function checkValidity() {
        return topicElement.checkValidity();
    }
</script>

<label for="topic">Topic</label>
<input id="topic" required bind:value={$topicName} bind:this={topicElement} />
