<!--
    (c) 2020 Open AR Cloud
    This code is licensed under MIT license (see LICENSE.md for details)
-->

<style>
    .addbutton {
        background-color: transparent;
        border: 0;
    }

    .addbutton img {
        width: 2rem;
    }

    .deletebutton {
        padding: 0;
        margin: 0 15px 0 -5px;
        border: 0;
        background-color: transparent;
    }

    .deletebutton img {
        width: 1.5rem;
    }
</style>

<script>
    export let data;

    function addBbox(event) {
        event.preventDefault();

        if (data) {
            data = [...data, ""];
        } else {
            data = [];
        }
    }

    function deleteBbox(event, index) {
        event.preventDefault();

        data.splice(index, 1);
        data = data;
    }

    function toggleBbox(event) {
        if (event.target.checked) {
            data = [];
        } else {
            data = undefined;
        }
    }
</script>


<dl>
    <dt>
        <input type="checkbox" checked="{data !== undefined}" on:change={(event) => toggleBbox(event)} />
        <span>BBox</span>
    </dt>
    {#if data}
        <dd>
        {#each data as box, index}
            <input type="number" bind:value="{box}"/>
            <button class="deletebutton" on:click={(event) => deleteBbox(event, index)}>
                <img src="/remove.svg" alt="Delete bounding box coordinate button" />
            </button>
        {/each}
        </dd>
    {/if}
</dl>

{#if data !== undefined}
    <button class="addbutton" disabled="{data === undefined}" on:click={addBbox}>
        <img src="/plus-sign.svg" alt="Add bounding box coordinate button" />
    </button>
{/if}