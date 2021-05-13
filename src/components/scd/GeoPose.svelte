<!--
    (c) 2020 Open AR Cloud
    This code is licensed under MIT license (see LICENSE.md for details)
-->

<style>
    dd label {
        width: 6rem;
    }
</style>

<script>
    export let data;
    export let inactive;
</script>


<div>
    <label for="geoposelatitude">Latitude</label>
    <input id="geoposelatitude" type="number" step="any" required disabled="{inactive}" bind:value={data.latitude}>
</div>

<div>
    <label for="geoposelongitude">Longitude</label>
    <input id="geoposelongitude" type="number" step="any" required bind:value={data.longitude}>
</div>

<div>
    <label for="geoposeellipsoidHeight">EllipsoidHeight</label>
    <input id="geoposeellipsoidHeight" type="number" step="any" required bind:value={data.ellipsoidHeight}>
</div>

<dl>
    <dt>Quaternion</dt>
    <dd>
        <label for="geoposequaternionx">X</label>
        <input id="geoposequaternionx" type="number" step="any" required bind:value={data.quaternion.x}>
    </dd>
    <dd>
        <label for="geoposequaterniony">Y</label>
        <input id="geoposequaterniony" type="number" step="any" required bind:value={data.quaternion.y}>
    </dd>
    <dd>
        <label for="geoposequaternionz">Z</label>
        <input id="geoposequaternionz" type="number" step="any" required bind:value={data.quaternion.z}>
    </dd>
    <dd>
        <label for="geoposequaternionw">W</label>
        <input id="geoposequaternionw" type="number" step="any" required bind:value={data.quaternion.w}>
    </dd>
</dl>
