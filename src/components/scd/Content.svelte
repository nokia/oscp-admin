<!--
    (c) 2020 Open AR Cloud
    This code is licensed under MIT license (see LICENSE.md for details)
-->

<script>
    import Keywords from './Keywords.svelte';

    export let data;

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
    <label for="contenturl">URL</label>
    <input id="contenturl" type="url" required bind:value={data.url} />
</div>

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
