<!--
    (c) 2020 Open AR Cloud
    This code is licensed under MIT license (see LICENSE.md for details)
-->

<style>
    fieldset {
        display: flex;
    }

    #cesiumContainer {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
    }
</style>

<script>
    import * as Cesium from 'cesium';
    import "cesium/Build/Cesium/Widgets/widgets.css";

    import { getServicesAtLocation } from 'ssd-access';
    import { v4 as uuidv4 } from 'uuid';

    import * as h3 from "h3-js";


    let viewer;
    let showMap = false;

    let countries = [{
        id: 1, text: `FI`, image: 'seattle.jpg'
    }, {
        id: 2, text: `IT`, image: 'bari.jpg'
    }, {
        id: 3, text: `RU`, image: 'seattle.jpg'
    }, {
        id: 4, text: `US`, image: 'seattle.jpg'
    }];
    let selectedCountry = countries[3];


    const cameraWalkingHeight = 2;  // meters
    const seattleLocation = {lat: 47.612, lon: -122.337};
    const bariLocation = {lat: 41.123, lon: 16.87};

    window.CESIUM_BASE_URL = '/';
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0NjMwMzYwNi1lNTJiLTQwOWItODc0NS0wOGVhMWJjMjBhNWQiLCJpZCI6MjQyNjIsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1ODQ5MTY5MjB9.5yH_PV4X2a_yfqoRqXGwAXcIBFN7G0Rg70lbh97Hi-Y';


    function initCesium(lat, lon) {
        const terrainProvider = Cesium.createWorldTerrain();
        const positions = [Cesium.Cartographic.fromDegrees(lon, lat)];

        Cesium.sampleTerrainMostDetailed(terrainProvider, positions)
            .then(updatedPositions => {
                viewer = new Cesium.Viewer('cesiumContainer', {
                    terrainProvider : terrainProvider
                });

                // viewer.scene.primitives.add(Cesium.createOsmBuildings());

                viewer.camera.flyTo({
                    destination: Cesium.Cartesian3.fromDegrees(
                        lon, lat, updatedPositions[0].height + cameraWalkingHeight),
                    orientation: {
                        heading: Cesium.Math.toRadians(0.0),
                        pitch: Cesium.Math.toRadians(0),
                    }
                })

                showMap = true;
                positionContent(lat, lon);
            });
    }

    function positionContent(lat, lon) {
        let referenceImage;

        const h3Index = h3.geoToH3(lat, lon, 8);

        fetch(`/localisationimages/${selectedCountry.image}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("ReferenceImage couldn't be loaded");
                }

                return response.arrayBuffer();
            })
            .then(buffer => {
                referenceImage = btoa(new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));
                return getServicesAtLocation(selectedCountry.text, h3Index)
            })
            .then(data => {
                if (data.length !== 0) {
                    return data[0].services[0].url;
                } else {
                    // no ssd available in the requested country. Checking with Augmented City as a fallback for now
                    return 'http://developer.augmented.city';
                }
            })
            .then(serviceUrl => {
                if (!serviceUrl.includes('https://')) {
                    serviceUrl = serviceUrl.replace('http://', 'https://');
                }

                const requestBody = {
                    "id": uuidv4(),
                    "timestamp": Date.now().toString(),
                    "type": "geopose",
                    "sensors": [{
                        "id": "0",
                        "type": "camera"
                    }, {
                        "id": "1",
                        "type": "geolocation"
                    }],
                    "sensorReadings": [{
                        "timestamp": Date.now().toString(),
                        "sensorId": "0",
                        "reading": {
                            "sequenceNumber": 0,
                            "imageFormat": "JPG",
                            "imageOrientation": {
                                "mirrored": false,
                                "rotation": 0
                            },
                            "imageBytes":  referenceImage
                        }
                    }, {
                            "timestamp": Date.now().toString(),
                            "sensorId": "1",
                            "reading": {
                                "latitude": lat,
                                "longitude": lon,
                                "altitude": 0
                            }
                        }
                    ]
                };
                const localisationUrl = `${serviceUrl}/scrs/geopose_objs`;
                fetch(localisationUrl, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestBody)
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }

                        return response.json();
                    })
                    .then(data => {
                        console.log(data);

                        placeContent(data);
                    })
                    .catch(error => {
                        console.error(error);
                    });
            })
    }

    function placeContent(content) {
        let position;
        let orientation;
        let ecef;

        content.scrs.forEach(item => {
            ecef = item.content.geopose.ecef;
            position = Cesium.Cartesian3.fromElements(ecef.x, ecef.y, ecef.z);
            orientation = new Cesium.Quaternion(ecef.quaternion[0], ecef.quaternion[1], ecef.quaternion[2], ecef.quaternion[3]);

            viewer.entities.add({
                name: 'pin',
                position: position,
                orientation: orientation,
                model: {
                    uri: '/pin/model.glb',
                    minimumPixelSize: 128,
                    maximumScale: 200,
                },
            });
        });
    }
</script>


<h3>Verify content placement in Cesium</h3>

<p>
    When content is made available for AR consumption, being able to verify its correct placement and visualisation
    will quickly become an important requirement. Using Cesium with its 3D tiles could be a great platform for this.
</p>

<dl>
    <dt>The process to place the content on a Cesium map is like this:</dt>
    <dd>Define region and context for the content to display</dd>
    <dd>Choose which Spatial Content Provider to use and request the content</dd>
    <dd>Add the content to Cesium at the contents GeoPose location and orientation</dd>
</dl>

<p>
    For this demo we list some locations where content is place. When logged in to the system, the specific locations
    where the respective tenant provides content for could be listed.
</p>

<p>
    Because we're using the discovery services, this works for any tenant in every region discovery services are
    available.
</p>

<fieldset>
    <!-- All hardcoded for now. The info will likely be possible to fetch from discovery service in the future -->
    <legend>Context</legend>
    <div>
        <label for="region">Region:</label>
        <select id="region" bind:value={selectedCountry}>
            {#each countries as country}
                <option value="{country}">{country.text}</option>
            {/each}
        </select>
    </div>
    <div>
        <label for="topic">Topic:</label>
        <select id="topic">
            <option>Entertainment</option>
            <option>History</option>
            <option>Transit</option>
        </select>
    </div>
    <div>
        <label for="keywords">Keywords:</label>
        <select id="keywords">
            <option>Shops</option>
            <option>Restaurants</option>
        </select>
    </div>
</fieldset>

<fieldset>
    <legend>List of locations with content for demo user</legend>
    <ul>
        <li on:click={() => initCesium(seattleLocation.lat, seattleLocation.lon)}>Seattle</li>
        <li on:click={() => initCesium(bariLocation.lat, bariLocation.lon)}>Bari</li>
    </ul>
</fieldset>

<div id="cesiumContainer" class:invisible={showMap === false}></div>