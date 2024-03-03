<!--
  (c) 2020 Open AR Cloud, This code is licensed under MIT license (see LICENSE.md for details)
  (c) 2024 Nokia, Licensed under the MIT License, SPDX-License-Identifier: MIT
-->

<script lang="ts">
    import type { BBox } from '@oarc/ssd-access';
    import { AddSolidIcon, CloseSolidIcon } from 'svelte-zondicons';
    import type { ChangeEventHandler } from 'svelte/elements';

    export let data: BBox | undefined;

    function addBbox(event: Event) {
        event.preventDefault();

        if (data) {
            data = [...data, '']; // TODO: this cannot be right, because BBox is a single tuple, and not a list of tuples.
        } else {
            data = [];
        }
    }

    function deleteBbox(event: Event, index: number) {
        event.preventDefault();

        data?.splice(index, 1);
        data = data;
    }

    const toggleBbox: ChangeEventHandler<HTMLInputElement> = (event) => {
        if (event.currentTarget.checked) {
            data = [];
        } else {
            data = undefined;
        }
    };
</script>

<dl>
    <dt>
        <input type="checkbox" checked={data !== undefined} on:change={(event) => toggleBbox(event)} />
        <span>BBox</span>
    </dt>
    {#if data}
        <dd>
            {#each data as box, index}
                <input type="number" bind:value={box} />
                <button class="deletebutton" on:click={(event) => deleteBbox(event, index)}>
                    <CloseSolidIcon size="1.5rem" color="red" />
                </button>
            {/each}
        </dd>
    {/if}
</dl>

{#if data !== undefined}
    <button class="addbutton" disabled={data === undefined} on:click={addBbox}>
        <AddSolidIcon size="2rem" />
    </button>
{/if}

<style>
    .addbutton {
        background-color: transparent;
        border: 0;
    }

    .deletebutton {
        padding: 0;
        margin: 0 15px 0 -5px;
        border: 0;
        background-color: transparent;
    }
</style>
