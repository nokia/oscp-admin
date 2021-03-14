<!--
    (c) 2020 Open AR Cloud
    This code is licensed under MIT license (see LICENSE.md for details)
-->

<script>
    import Keywords from './Keywords.svelte';
    import References from './References.svelte';
    import { createEventDispatcher } from 'svelte';

    export let data;

    const dispatch = createEventDispatcher();


    function toggleSize(event) {
        if (event.target.checked) {
            data.size = '';
        } else {
            data.size = undefined;
        }
    }

    function toggleBbox(event) {
        if (event.target.checked) {
            data.bbox = '';
        } else {
            data.bbox = undefined;
        }
    }

    function toggleDescription(event) {
        if (event.target.checked) {
            data.description = '';
        } else {
            data.description = undefined;
        }
    }

    function togglePlacekey(event) {
        if (event.target.checked) {
            data.placekey = '';
        } else {
            data.placekey = undefined;
        }
    }
</script>


<div>
    <label for="contentid">ID</label>
    <input id="contentid" required bind:value={data.id} />
</div>

<div>
    <label for="contenttype">Type</label>
    <input id="contenttype" required bind:value={data.type} />
</div>

<div>
    <label for="contenttitle">Title</label>
    <input id="contenttitle" required bind:value={data.title} />
</div>

<div>
    <label for="contentdescription">
        <input type="checkbox" checked="{data.description !== undefined}" on:change={toggleDescription} />
        <span>Description</span>
    </label>
    <input id="contentdescription" disabled="{data.description === undefined}" bind:value={data.description} />
</div>

<Keywords bind:data={data.keywords} />

<div>
    <label for="contentplacekey">
        <input type="checkbox" checked="{data.placekey !== undefined}" on:change={togglePlacekey} />
        <span>Placekey</span>
    </label>
    <input id="contentplacekey" disabled="{data.placekey === undefined}" bind:value={data.placekey} />
</div>

<References bind:data={data.refs} on:refsUpdated={() => dispatch('refsUpdated')} />

<div>
    <label for="contentsize">
        <input type="checkbox" checked="{data.size !== undefined}" on:change={toggleSize} />
        <span>Size</span>
    </label>
    <input id="contentsize" disabled="{data.size === undefined}" type="number" bind:value={data.size} />
</div>

<div>
    <label for="contentbbox">
        <input type="checkbox" checked="{data.bbox !== undefined}" on:change={toggleBbox} />
        <span>Bounding Box</span>
    </label>
    <input id="contentbbox" disabled="{data.bbox === undefined}" bind:value={data.bbox} />
</div>
