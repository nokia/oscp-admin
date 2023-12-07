<script lang="ts">
    import { AddSolidIcon, CloseSolidIcon } from 'svelte-zondicons';
    import { scr_definition } from '@oarc/scd-access';

    export let data: { type: string; value: string }[];

    function addDefinition() {
        if (data) {
            data = [...data, JSON.parse(JSON.stringify(scr_definition))];
        } else {
            data = [JSON.parse(JSON.stringify(scr_definition))];
        }
    }

    function deleteDefinition(event: Event, index: number) {
        data.splice(index, 1);
        data = data;
    }
</script>

<dl>
    <dt>
        <span>Definitions</span>
    </dt>
    {#if data}
        {#each data as definition, index}
            <dd>
                <span>
                    <label for="type">Type</label>
                    <input id="type" required bind:value={definition.type} />
                </span>
                <span>
                    <label for="value">Value</label>
                    <input id="value" required type="text" bind:value={definition.value} />
                    <button class="deletebutton" on:click|preventDefault={(event) => deleteDefinition(event, index)}>
                        <CloseSolidIcon size="1.5rem" color="red" />
                    </button>
                </span>
            </dd>
        {/each}
    {/if}
</dl>

{#if data !== undefined}
    <button class="addbutton" on:click|preventDefault={addDefinition}>
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
