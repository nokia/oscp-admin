<!--
    (c) 2020 Open AR Cloud
    This code is licensed under MIT license (see LICENSE.md for details)
-->

<script lang="ts">
    let topicElement: HTMLInputElement;

    export function value() {
        return topicElement.value;
    }

    export function checkValidity() {
        return topicElement.checkValidity();
    }
</script>

<label for="topic">Topic</label>
<input id="topic" required bind:this={topicElement} />
