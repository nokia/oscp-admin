<script lang="ts">
    import { AddSolidIcon, CloseSolidIcon } from 'svelte-zondicons';
    import type { ChangeEventHandler } from 'svelte/elements';

    export let data: { type?: string; value?: string }[] | undefined;

    function addProperty(event: Event) {
        event.preventDefault();

        if (data) {
            data = [...data, {}];
        } else {
            data = [];
        }
    }

    function deleteProperty(event: Event, index: number) {
        event.preventDefault();

        data?.splice(index, 1);
        // noinspection SillyAssignmentJS
        data = data;
    }

    const toggleProperties: ChangeEventHandler<HTMLInputElement> = (event) => {
        if (event.currentTarget.checked) {
            data = [];
        } else {
            data = undefined;
        }
    };
</script>

<dl>
    <dt>
        <input type="checkbox" checked={data !== undefined} on:change={toggleProperties} />
        <span>Properties</span>
    </dt>
    {#if data}
        <dd>
            {#each data as property, index}
                <label for="propertykey">Type</label>
                <input id="propertykey" bind:value={property.type} />

                <label for="propertyvalue">Value</label>
                <input id="propertyvalue" bind:value={property.value} />

                <button class="deletebutton" on:click={(event) => deleteProperty(event, index)}>
                    <CloseSolidIcon size="1.5rem" color="red" />
                </button>
            {/each}
        </dd>
    {/if}
</dl>

{#if data !== undefined}
    <button class="addbutton" on:click={addProperty}>
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
