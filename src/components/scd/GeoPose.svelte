<!--
    (c) 2020 Open AR Cloud
    This code is licensed under MIT license (see LICENSE.md for details)
-->

<style>
    dt {
        text-align: left;
        font-weight: 700;
    }

    dd label {
        width: 6rem;
    }
</style>

<script>
    export let data;
</script>


<div>
    <label for="geoposelongitude">Longitude</label>
    <input id="geoposelongitude" type="number" step="any" required bind:value={data.longitude}>
</div>

<div>
    <label for="geoposelatitude">Latitude</label>
    <input id="geoposelatitude" type="number" step="any" required bind:value={data.latitude}>
</div>

<div>
    <label for="geoposeellipsoidHeight">EllipsoidHeight</label>
    <input id="geoposeellipsoidHeight" type="number" step="any" required bind:value={data.ellipsoidHeight}>
</div>

<dl>
    <dt>Quaternion</dt>
    <dd>
        <label for="geoposequaternionx">X</label>
        <input id="geoposequaternionx" type="number" step="any" required bind:value={data.quaternion[0]}>
    </dd>
    <dd>
        <label for="geoposequaterniony">Y</label>
        <input id="geoposequaterniony" type="number" step="any" required bind:value={data.quaternion[1]}>
    </dd>
    <dd>
        <label for="geoposequaternionz">Z</label>
        <input id="geoposequaternionz" type="number" step="any" required bind:value={data.quaternion[2]}>
    </dd>
    <dd>
        <label for="geoposequaternionw">W</label>
        <input id="geoposequaternionw" type="number" step="any" required bind:value={data.quaternion[3]}>
    </dd>
</dl>