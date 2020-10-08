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

<script>
    import { AddSolidIcon, CloseSolidIcon } from 'svelte-zondicons';
    import { scr_reference } from 'scd-access';

    export let data


    function addUrl(event) {
        event.preventDefault();

        if (data) {
            data = [...data, JSON.parse(JSON.stringify(scr_reference))];
        } else {
            data = [JSON.parse(JSON.stringify(scr_reference))];
        }
    }

    function deleteUrl(event, index) {
        event.preventDefault();

        data.splice(index, 1);
        data = data;
    }
</script>


<dl>
    <dt>
        <span>References</span>
    </dt>
    {#if data}
        {#each data as reference, index}
        <dd>
            <span>
                <label>Content Type</label>
                <input required bind:value="{reference.contentType}"/>
            </span>
            <span>
                <label>URL</label>
                <input required type="url" bind:value="{reference.url}"/>
                <button class="deletebutton" on:click={(event) => deleteUrl(event, index)}>
                    <CloseSolidIcon size="1.5rem" color="red" />
                </button>
            </span>
        </dd>
        {/each}
    {/if}
</dl>

{#if data !== undefined}
    <button class="addbutton" on:click={addUrl}>
        <AddSolidIcon size="2rem" />
    </button>
{/if}