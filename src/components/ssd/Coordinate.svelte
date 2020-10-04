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
        margin: 0;
        border: 0;
        background-color: transparent;
    }
</style>

<script>
    import { AddSolidIcon, CloseSolidIcon } from 'svelte-zondicons';

    export let data;

    function addCoordinate(event) {
        event.preventDefault();

        data = [...data, [0, 0]];
    }

    function deleteCoordinate(event, index) {
        event.preventDefault();

        data.splice(index, 1);
        data = data;
    }
</script>


<dl>
    <dt>Coordinates</dt>
    {#each data as coordinate, index}
        <dd>
            <span>
                <label for="coordlon1">Lat</label>
                <input id="coordlon1" type="number" step="any" required bind:value="{coordinate[1]}"/>
            </span>
            <span>
                <label for="coordlat1">Lon</label>
                <input id="coordlat1" type="number" step="any" required bind:value="{coordinate[0]}"/>

                <button class="deletebutton" on:click={(event) => deleteCoordinate(event, index)}>
                    <CloseSolidIcon size="1.5rem" color="red" />
                </button>
            </span>
        </dd>
    {/each}
</dl>

<button class="addbutton" on:click={addCoordinate}>
    <AddSolidIcon size="2rem" />
</button>
