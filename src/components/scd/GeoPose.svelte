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

<dl>
    <dt>Position</dt>
    <div>
        <label for="geoposepositionlat">Latitude</label>
        <input id="geoposepositionlat" type="number" step="any" required disabled="{inactive}" bind:value={data.position.lat}>
    </div>

    <div>
        <label for="geoposepositionlon">Longitude</label>
        <input id="geoposepositionlon" type="number" step="any" required bind:value={data.position.lon}>
    </div>

    <div>
        <label for="geoposepositionh">Height</label>
        <input id="geoposepositionh" type="number" step="any" required bind:value={data.position.h}>
    </div>
</dl>
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
