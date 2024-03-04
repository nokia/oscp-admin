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
        const q = new THREE.Quaternion(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
        q.normalize();
        return new THREE.Euler().setFromQuaternion(q, 'XYZ');
    };

    const eulerToQuaternion = (euler: THREE.Euler): Quaternion => {
        const q = new THREE.Quaternion().setFromEuler(euler);
        q.normalize();
        return { // clamp very small values to zero
            x: Math.abs(q.x) > 0.01 ? q.x : 0.0,
            y: Math.abs(q.y) > 0.01 ? q.y : 0.0,
            z: Math.abs(q.z) > 0.01 ? q.z : 0.0,
            w: Math.abs(q.w) > 0.01 ? q.w : 0.0,
        };
    };

    const onChangeQuat = (quatIndex: keyof Quaternion, value: number) => {
        data.quaternion[quatIndex] = value;
        const euler = quaternionToEuler(data.quaternion);
        eulerDeg = {
            x: convertRadToDeg(euler.x),
            y: convertRadToDeg(euler.y),
            z: convertRadToDeg(euler.z),
        };
    };

    const onChangeEuler = (eulerIndex: 'x' | 'y' | 'z', degrees: number) => {
        eulerDeg[eulerIndex] = degrees;
        const radians = convertDegToRad(degrees);
        eulerRad[eulerIndex] = radians;

        data.quaternion = eulerToQuaternion(eulerRad);
    };

    const convertDegToRad = (degrees: number) => {
        return degrees * (Math.PI / 180.0);
    };

    const convertRadToDeg = (radians: number) => {
        return radians * (180.0 / Math.PI);
    };

    let eulerRad = quaternionToEuler(data.quaternion);
    let eulerDeg = {
        x: convertRadToDeg(eulerRad.x),
        y: convertRadToDeg(eulerRad.y),
        z: convertRadToDeg(eulerRad.z),
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
                step=0.01
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
                step=0.01
                min=-1.0
                max=1.0
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
                step=0.01
                min=-1.0
                max=1.0
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
                step=0.01
                min=-1.0
                max=1.0
                required
                value={data.quaternion.w}
                on:change={(event) => {
                    onChangeQuat('w', parseFloat(event.currentTarget.value));
                }}
            />
        </dd>
    </dl>
    <dl>
        <dt>Euler angles (degrees)</dt>
        <dd>
            <label for="euleranglex">East</label>
            <input
                id="euleranglex"
                type="number"
                step="any"
                min=-180
                max=180
                required
                value={eulerDeg.x}
                on:change={(event) => {
                    onChangeEuler('x', parseFloat(event.currentTarget.value));
                }}
            />
        </dd>
        <dd>
            <label for="eulerangley">North</label>
            <input
                id="eulerangley"
                type="number"
                step="any"
                min=-180
                max=180
                required
                value={eulerDeg.y}
                on:change={(event) => {
                    onChangeEuler('y', parseFloat(event.currentTarget.value));
                }}
            />
        </dd>
        <dd>
            <label for="euleranglez">Up</label>
            <input
                id="euleranglez"
                type="number"
                step="any"
                min=-180
                max=180
                required
                value={eulerDeg.z}
                on:change={(event) => {
                    onChangeEuler('z', parseFloat(event.currentTarget.value));
                }}
            />
        </dd>
    </dl>
</div>

<style>
    dd label {
        width: 6rem;
    }
</style>
