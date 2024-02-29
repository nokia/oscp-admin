<!--
  (c) 2020 Open AR Cloud, This code is licensed under MIT license (see LICENSE.md for details)
  (c) 2024 Nokia, Licensed under the MIT License, SPDX-License-Identifier: MIT
-->
<!-- 3D Viewer code adapted from https://svelte.dev/repl/8ea0488302bb434991cc5b82f653cdb5?version=3.48.0 -->
<!-- text loading adapted from https://github.com/mrdoob/three.js/blob/master/examples/webgl_geometry_text.html -->

<script lang="ts">
    import { onMount } from 'svelte';
    import * as THREE from 'three';
    import * as SC from 'svelte-cubed';

    import { FontLoader, Font } from 'three/addons/loaders/FontLoader.js';
    import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
    //import { TransformControls } from 'three/addons/controls/TransformControls.js';

    import ReusableGltf from './ReusableGltf.svelte';
    import Image from './Image.svelte';
    import type { Geopose } from '@oarc/scd-access';

    export let geopose: Geopose;
    export let contentUrl: string;
    export let contentMimeType: string;
    //export let contentGeoPose:GeoPose
    let contentEuler: THREE.Euler;
    //const transformControls:TransformControls = new TransformControls() // TODO:  we cannot attach to the object because it is hidden in SC.ReusableGltf :(  Shoudl we add +- Euler rotation buttons instead?

    let font: Font | undefined = undefined;

    let X: THREE.Mesh = new THREE.Mesh();
    let Y: THREE.Mesh = new THREE.Mesh();
    let Z: THREE.Mesh = new THREE.Mesh();
    let E: THREE.Mesh = new THREE.Mesh();
    let N: THREE.Mesh = new THREE.Mesh();
    let U: THREE.Mesh = new THREE.Mesh();
    const axisLabelMaterial = new THREE.MeshBasicMaterial({ color: 0x444444 });

    onMount(() => {
        loadFont('helvetiker_regular');
    });

    $: contentGeoPose = {
        position: geopose.position,
        quaternion: geopose.quaternion,
    };

    // convert from ENU to WebGL:
    // X = E, Y = U, Z = -N
    $: contentQuaternion = new THREE.Quaternion(contentGeoPose.quaternion.x, contentGeoPose.quaternion.z, -contentGeoPose.quaternion.y, contentGeoPose.quaternion.w);
    $: contentEuler = new THREE.Euler().setFromQuaternion(contentQuaternion, 'XYZ');

    function loadFont(fontName: string) {
        const loader = new FontLoader();
        loader.load('/fonts/' + fontName + '.typeface.json', function (loadedFont: Font) {
            font = loadedFont;
            createTextLabels(font);
        });
    }

    function createTextLabels(font: Font) {
        X = createText('X', font, new THREE.Vector3(1.0, 0.0, 0.0)); //, new THREE.Vector3(0, Math.PI/2, 0));
        Y = createText('Y', font, new THREE.Vector3(0.0, 1.0, 0.0));
        Z = createText('Z', font, new THREE.Vector3(0.0, 0.0, 1.0));
        E = createText('E', font, new THREE.Vector3(1.5, 0.0, 0.0));
        N = createText('N', font, new THREE.Vector3(0.0, 0.0, -1.5));
        U = createText('U', font, new THREE.Vector3(0.0, 1.5, 0.0));
    }

    function createText(text: string, font: Font, position: THREE.Vector3 = new THREE.Vector3(0, 0, 0), rotation: THREE.Vector3 = new THREE.Vector3(0, 0, 0), color = 0x444444) {
        const textGeometry: TextGeometry = new TextGeometry(text, {
            font: font,
            size: 0.1,
            height: 0.01,
            curveSegments: 12,
        });

        textGeometry.computeBoundingBox();
        const centerOffset = 0.0; //- 0.5 * ( textGeometry.boundingBox!.max.x - textGeometry.boundingBox!.min.x );
        const hover = 0.0;

        const textMaterial = new THREE.MeshBasicMaterial({ color: color });

        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.x = position.x + centerOffset;
        textMesh.position.y = position.y + hover;
        textMesh.position.z = position.z + 0.0;

        textMesh.rotation.x = rotation.x;
        textMesh.rotation.y = rotation.y;
        textMesh.rotation.z = rotation.z;

        return textMesh;
    }
</script>

{#if contentMimeType === 'model/gltf+json' || contentMimeType === 'model/glb'}
    <SC.Canvas background={new THREE.Color(0xf0f0f0)} antialias>
        <SC.PerspectiveCamera position={[2, 2, 2]} near={0.1} far={10} fov={50} />
        <SC.OrbitControls enabled={true} enableZoom={true} autoRotate={true} autoRotateSpeed={1} enableDamping={true} dampingFactor={0.1} target={[0, 0, 0]} />
        <SC.AmbientLight color={new THREE.Color(0xffffff)} intensity={1.0} />
        <ReusableGltf modelURL={contentUrl} scale={[1, 1, 1]} rotation={[contentEuler.x, contentEuler.y, contentEuler.z, 'XYZ']} />
        <SC.Primitive object={new THREE.GridHelper(50, 50, 0x444444, 0x555555)} position={[0.0, 0.0, 0.0]} />
        <SC.Primitive object={new THREE.AxesHelper(5)} position={[0.0, 0.001, 0.0]} />
        <SC.Group position={[0, 0, 0]}>
            <SC.Mesh geometry={X.geometry} position={X.position.toArray()} rotation={[X.rotation.x, X.rotation.y, X.rotation.z, 'XYZ']} material={axisLabelMaterial} />
            <SC.Mesh geometry={Y.geometry} position={Y.position.toArray()} rotation={[Y.rotation.x, Y.rotation.y, Y.rotation.z, 'XYZ']} material={axisLabelMaterial} />
            <SC.Mesh geometry={Z.geometry} position={Z.position.toArray()} rotation={[Z.rotation.x, Z.rotation.y, Z.rotation.z, 'XYZ']} material={axisLabelMaterial} />
        </SC.Group>
        <SC.Group position={[0, 0, 0]}>
            <SC.Mesh geometry={E.geometry} position={E.position.toArray()} rotation={[E.rotation.x, E.rotation.y, E.rotation.z, 'XYZ']} material={axisLabelMaterial} />
            <SC.Mesh geometry={N.geometry} position={N.position.toArray()} rotation={[N.rotation.x, N.rotation.y, N.rotation.z, 'XYZ']} material={axisLabelMaterial} />
            <SC.Mesh geometry={U.geometry} position={U.position.toArray()} rotation={[U.rotation.x, U.rotation.y, U.rotation.z, 'XYZ']} material={axisLabelMaterial} />
        </SC.Group>
    </SC.Canvas>
{:else if contentMimeType === 'image/png' || contentMimeType === 'image/jpg'}
    <Image width={300} src={contentUrl}></Image>
{/if}
