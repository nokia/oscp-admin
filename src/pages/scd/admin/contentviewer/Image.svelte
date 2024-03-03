<!--
  (c) 2020 Open AR Cloud, This code is licensed under MIT license (see LICENSE.md for details)
  (c) 2024 Nokia, Licensed under the MIT License, SPDX-License-Identifier: MIT
-->

<!-- Image source adapted from https://svelte.dev/repl/327aa441312e41d7937b4adcdab86765?version=3.46.2 -->

{#if loaded}
    <img {src} alt="Document" {width} />
{:else if failed}
    <img src="https://icon-library.com/images/not-found-icon/not-found-icon-20.jpg" alt="Not Found" />
{:else if loading}
    <img src="https://c.tenor.com/On7kvXhzml4AAAAi/loading-gif.gif" alt="Loading..." />
{/if}

<script lang='ts'>
    import { onMount } from 'svelte'
    export let src:string;
    export let width:number;

    let loaded = false;
    let failed = false;
    let loading = false;

    onMount(() => {
        const img = new Image();
        img.src = src;
        loading = true;

        img.onload = () => {
            loading = false;
            loaded = true;
        };
        img.onerror = () => {
            loading = false;
            failed = true;
        };
    })
</script>
