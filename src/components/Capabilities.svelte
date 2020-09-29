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

    function addCapability(event) {
        event.preventDefault();

        if (data) {
            data = [...data, ""];
        } else {
            data = [];
        }
    }

    function deleteCapability(event, index) {
        event.preventDefault();

        data.splice(index, 1);
        data = data;
    }

    function toggleCapabilities(event) {
        if (event.target.checked) {
            data = [];
        } else {
            data = undefined;
        }
    }
</script>


<dl>
    <dt>
        <input type="checkbox" checked="{data !== undefined}" on:change={toggleCapabilities} />
        <span>Capabilities</span>
    </dt>
    {#if data}
        <dd>
        {#each data as capability, index}
            <input bind:value="{capability}" />
            <button class="deletebutton" on:click={(event) => deleteCapability(event, index)}>
                <img src="/remove.svg" alt="Delete capability button" />
            </button>
        {/each}
        </dd>
    {/if}
</dl>

{#if data !== undefined}
    <button class="addbutton" on:click={addCapability}>
        <img src="/plus-sign.svg" alt="Add capability button"/>
    </button>
{/if}