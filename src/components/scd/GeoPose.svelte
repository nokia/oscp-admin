<!--
  (c) 2020 Open AR Cloud, This code is licensed under MIT license (see LICENSE.md for details)
  (c) 2024 Nokia, Licensed under the MIT License, SPDX-License-Identifier: MIT
-->

<script lang="ts">
    import type { Geopose, Quaternion } from '@oarc/scd-access';
    import * as THREE from 'three';

    export let data: Geopose;
    export let inactive = false;

    const quaternionToEuler = (quaternion: Quaternion): THREE.Euler => {
        return new THREE.Euler().setFromQuaternion(new THREE.Quaternion(data.quaternion.x, data.quaternion.z, -data.quaternion.y, data.quaternion.w), 'XYZ');
    };

    const eulerToQuaternion = (euler: THREE.Euler): Quaternion => {
        const threeJsQuaternion = new THREE.Quaternion().setFromEuler(euler);
        return {
            x: threeJsQuaternion.x,
            y: threeJsQuaternion.z,
            z: -threeJsQuaternion.y,
            w: threeJsQuaternion.w,
        };
    };

    const onChangeQuat = (quatIndex: keyof Quaternion, value: number) => {
        data.quaternion[quatIndex] = value;
        const euler = quaternionToEuler(data.quaternion);
        eulerDegrees = {
            x: convertRadToDeg(euler.x),
            y: convertRadToDeg(euler.y),
            z: convertRadToDeg(euler.z),
        };
    };

    const onChangeEuler = (eulerIndex: 'x' | 'y' | 'z', degrees: number) => {
        eulerDegrees[eulerIndex] = degrees;
        const radians = convertDegToRad(degrees);
        euler[eulerIndex] = radians;
        data.quaternion = eulerToQuaternion(euler);
    };

    const convertDegToRad = (degrees: number) => {
        return degrees * (Math.PI / 180);
    };

    const convertRadToDeg = (radians: number) => {
        return radians * (180 / Math.PI);
    };

    let euler = new THREE.Euler().setFromQuaternion(new THREE.Quaternion(data.quaternion.x, data.quaternion.z, -data.quaternion.y, data.quaternion.w), 'XYZ');
    let eulerDegrees = {
        x: convertRadToDeg(euler.x),
        y: convertRadToDeg(euler.y),
        z: convertRadToDeg(euler.z),
    };
</script>

<dl>
    <dt>Position</dt>
    <div>
        <label for="geoposepositionlat">Latitude</label>
        <input id="geoposepositionlat" type="number" step="any" required disabled={inactive} bind:value={data.position.lat} />
    </div>

    <div>
        <label for="geoposepositionlon">Longitude</label>
        <input id="geoposepositionlon" type="number" step="any" required bind:value={data.position.lon} />
    </div>

    <div>
        <label for="geoposepositionh">Height</label>
        <input id="geoposepositionh" type="number" step="any" required bind:value={data.position.h} />
    </div>
</dl>
<div style="display: flex;">
    <dl>
        <dt>Quaternion</dt>
        <dd>
            <label for="geoposequaternionx">X</label>
            <input
                id="geoposequaternionx"
                type="number"
                step="any"
                required
                value={data.quaternion.x}
                on:change={(event) => {
                    onChangeQuat('x', parseFloat(event.currentTarget.value));
                }}
            />
        </dd>
        <dd>
            <label for="geoposequaterniony">Y</label>
            <input
                id="geoposequaterniony"
                type="number"
                step="any"
                required
                value={data.quaternion.y}
                on:change={(event) => {
                    onChangeQuat('y', parseFloat(event.currentTarget.value));
                }}
            />
        </dd>
        <dd>
            <label for="geoposequaternionz">Z</label>
            <input
                id="geoposequaternionz"
                type="number"
                step="any"
                required
                value={data.quaternion.z}
                on:change={(event) => {
                    onChangeQuat('z', parseFloat(event.currentTarget.value));
                }}
            />
        </dd>
        <dd>
            <label for="geoposequaternionw">W</label>
            <input
                id="geoposequaternionw"
                type="number"
                step="any"
                required
                value={data.quaternion.w}
                on:change={(event) => {
                    onChangeQuat('w', parseFloat(event.currentTarget.value));
                }}
            />
        </dd>
    </dl>
    <dl>
        <dt>Euler angles (order: xyz)</dt>
        <dd>
            <label for="euleranglex">X</label>
            <input
                id="euleranglex"
                type="number"
                step="any"
                required
                value={eulerDegrees.x}
                on:change={(event) => {
                    onChangeEuler('x', parseFloat(event.currentTarget.value));
                }}
            />
        </dd>
        <dd>
            <label for="eulerangley">Y</label>
            <input
                id="eulerangley"
                type="number"
                step="any"
                required
                value={eulerDegrees.y}
                on:change={(event) => {
                    onChangeEuler('y', parseFloat(event.currentTarget.value));
                }}
            />
        </dd>
        <dd>
            <label for="euleranglez">Z</label>
            <input
                id="euleranglez"
                type="number"
                step="any"
                required
                value={eulerDegrees.z}
                on:change={(event) => {
                    onChangeEuler('z', parseFloat(event.currentTarget.value));
                }}
            />
        </dd>
    </dl>
</div>

<!--
    (c) 2020 Open AR Cloud
    This code is licensed under MIT license (see LICENSE.md for details)
-->

<style>
    dd label {
        width: 6rem;
    }
</style>
