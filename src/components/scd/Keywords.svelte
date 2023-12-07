<script lang="ts">
    import { AddSolidIcon, CloseSolidIcon } from 'svelte-zondicons';
    import type { ChangeEventHandler } from 'svelte/elements';

    export let data: string[] | undefined;

    function addKeyword(event: Event) {
        event.preventDefault();

        if (data) {
            data = [...data, ''];
        } else {
            data = [];
        }
    }

    function deleteKeyword(event: Event, index: number) {
        event.preventDefault();

        data?.splice(index, 1);
        data = data;
    }

    const toggleKeywords: ChangeEventHandler<HTMLInputElement> = (event) => {
        if (event.currentTarget.checked) {
            data = [];
        } else {
            data = undefined;
        }
    };
</script>

<dl>
    <dt>
        <input type="checkbox" checked={data !== undefined} on:change={toggleKeywords} />
        <span>Keywords</span>
    </dt>
    {#if data}
        <dd>
            {#each data as keyword, index}
                <input bind:value={keyword} />
                <button class="deletebutton" on:click={(event) => deleteKeyword(event, index)}>
                    <CloseSolidIcon size="1.5rem" color="red" />
                </button>
            {/each}
        </dd>
    {/if}
</dl>

{#if data !== undefined}
    <button class="addbutton" on:click={addKeyword}>
        <AddSolidIcon size="2rem" />
    </button>
{/if}

<!--
    (c) 2020 Open AR Cloud
    This code is licensed under MIT license (see LICENSE.md for details)
-->

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
