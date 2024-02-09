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

    import { FontLoader } from 'three/addons/loaders/FontLoader.js';
    import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

    import ReusableGltf from './ReusableGltf.svelte';
    import Image from './Image.svelte'

    export let contentUrl:string;
    export let contentMimeType:string

    let font:THREE.Font | undefined = undefined;
    let textGroupXYZ: THREE.Group | undefined = undefined;
    let textGroupENU: THREE.Group | undefined = undefined;

    onMount(() => {
    //    loadFont('helveticer_regular');
    });

    function loadFont(fontName:string) {
        const loader = new FontLoader();
        loader.load('fonts/' + fontName + '.typeface.json',   // TODO: for some reason instead of this json the index.html is returned, which of course cannot be parsed.
            function ( loadedFont:THREE.Font ) {
                font = loadedFont;
                createTextLabels();
            })
        ;
    }

    function createText(text:string, font:THREE.Font, position:THREE.Vector3 = new THREE.Vector3(0,0,0), rotation:THREE.Vector3 = new THREE.Vector3(0,0,0)) {
        const textGeometry:TextGeometry = new TextGeometry(text, {
            font: font,
            size: 5,
			height: 0.25,
			curveSegments: 12
        } );

        textGeometry.computeBoundingBox();
        const centerOffset = - 0.5 * ( textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x );
        const hover = 30;

        const textMaterial = new THREE.BasicMaterial({ color: 0x888888 });

        const textMesh = new THREE.Mesh( textGeometry, textMaterial );
        textMesh.position.x = position.x + centerOffset;
        textMesh.position.y = position.y + hover;
        textMesh.position.z = position.z + 0.0;

        textMesh.rotation.x = rotation.x;
        textMesh.rotation.y = rotation.y;
        textMesh.rotation.z = rotation.z;

        return textMesh;
    }

    function createTextLabels() {
        textGroupXYZ = new THREE.Group();
        textGroupXYZ.position = new THREE.Vector3(0.0, 0.0, 0.0);
        textGroupXYZ.add(createText('X', font, THREE.Vector3(1.0, 0.0, 0.0)), THREE.Vector3(0, Math.PI/2, 0));
        textGroupXYZ.add(createText('Y', font, THREE.Vector3(0.0, 1.0, 0.0)));
        textGroupXYZ.add(createText('Z', font, THREE.Vector3(0.0, 0.0, 1.0)));

        textGroupENU = new THREE.Group();
        textGroupENU.position = new THREE.Vector3(0.0, 0.0, 0.0);
        textGroupENU.add(createText('East', font, THREE.Vector3(1.5, 0.0, 0.0)));
        textGroupENU.add(createText('North', font, THREE.Vector3(0.0, 0.0, -1.5)));
        textGroupENU.add(createText('Up', font, THREE.Vector3(0.0, 1.5, 0.0)));
    }

</script>

{#if contentMimeType === 'model/gltf+json'}
    <SC.Canvas background={new THREE.Color(0xf0f0f0)} antialias>
        <SC.PerspectiveCamera position={[2, 2, 2]} near={0.1} far={10} fov={50} />
        <SC.OrbitControls enabled={true} enableZoom={true} autoRotate={true} autoRotateSpeed={1} enableDamping={true} dampingFactor={0.1} target={[0, 0, 0]} />
        <SC.AmbientLight color={new THREE.Color(0xffffff)} intensity={1.0} />
        <ReusableGltf modelURL={contentUrl} scale={[1, 1, 1]} />
        <SC.Primitive object={new THREE.GridHelper(50, 50, 0x444444, 0x555555)} position={[0.0, 0.0, 0.0]} />
        <SC.Primitive object={new THREE.AxesHelper(5)} position={[0.0, 0.001, 0.0]}/>
    </SC.Canvas>
{:else if contentMimeType === 'image/png' || contentMimeType === 'image/jpg'}
    <Image width={300} src={contentUrl}>
    </Image>
{/if}
