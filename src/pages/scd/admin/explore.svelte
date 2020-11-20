<!--
    (c) 2020 Open AR Cloud
    This code is licensed under MIT license (see LICENSE.md for details)
-->

<script>
    import { onMount } from 'svelte';

    import * as Cesium from 'cesium';
    import "cesium/Build/Cesium/Widgets/widgets.css";

    window.CESIUM_BASE_URL = '/';
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0NjMwMzYwNi1lNTJiLTQwOWItODc0NS0wOGVhMWJjMjBhNWQiLCJpZCI6MjQyNjIsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1ODQ5MTY5MjB9.5yH_PV4X2a_yfqoRqXGwAXcIBFN7G0Rg70lbh97Hi-Y';

    let viewer;
    onMount(async () => {
        viewer = new Cesium.Viewer('cesiumContainer');

        const buildingTileset = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
            url : 'https://kartta.hel.fi/3d/datasource-data/e9cfc1bb-a015-4a73-b741-7535504c61bb/tileset.json'
        }));


        // Fly the camera to San Francisco at the given longitude, latitude, and height.
        viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(24.953270, 60.167598, 10),
            orientation: {
                heading: Cesium.Math.toRadians(0.0),
                pitch: Cesium.Math.toRadians(0),
            }
        })
    });

</script>


<div id="cesiumContainer"></div>