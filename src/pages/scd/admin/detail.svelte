<!--
  (c) 2020 Open AR Cloud, This code is licensed under MIT license (see LICENSE.md for details)
  (c) 2024 Nokia, Licensed under the MIT License, SPDX-License-Identifier: MIT
-->

<script lang="ts">
    import { onMount } from 'svelte';
    import { url, route, params, goto } from '@sveltech/routify';

    import { authStore, getContentWithId, deleteWithId, putContent, type SCR } from '@oarc/scd-access';
    import { oscpScdUrl } from '../../../core/store';

    import Form from '../../../components/Form.svelte';
    import SCRComponent from '../../../components/scd/SCR.svelte';

    import { CheveronLeftIcon } from 'svelte-zondicons';
    import type { MouseEventHandler } from 'svelte/elements';



    import * as THREE from "three";
    import * as SC from "svelte-cubed";
    import ReusableGLTF from "./contentviewer/ReusableGltf.svelte";
    import Loading from "./contentviewer/Loading.svelte";
    import { statusOfModels, modelURL, modelsLoading, updateModelStatus } from "./contentviewer/editorStore";
    function handleViewerStatusChange(evt:any) {
        updateModelStatus(evt.detail.name, evt.detail.status);
    }


    let data: SCR | undefined;
    let returnPath = ($route as any).last ? `${($route as any).last.path}?${new URLSearchParams(($route as any).last.params)}` : '/scd/admin/editcontent';

    onMount(() => {
        getContentWithId($oscpScdUrl, $params.topic, $params.id)
            .then((contents) => (data = contents))
            .catch((error) => console.log(`Server access error: ${error}`));
    });

    function handleDelete() {
        // TODO: Show dialog - maybe

        authStore
            .getToken()
            .then((token) => {
                deleteWithId($oscpScdUrl, $params.topic, $params.id, token || '');
            })
            .then(() => $goto(returnPath))
            .catch((error) => console.error(`Failed to delete: ${error}`));
    }

    const handleSave: MouseEventHandler<HTMLButtonElement> = async (event) => {
        event.preventDefault();

        if (data) {
            const token = await authStore.getToken();
            try {
                data.timestamp = Date.now();
                const response = putContent($oscpScdUrl, $params.topic, data, data.id, token || '');
                console.log(`Record created: ${response}`);
                $goto(returnPath);
            } catch (error) {
                console.log(`New SCR not sent - ${error}`);
            }
        }
    };
    const urlReturnPath = (): any => {
        return $url(returnPath);
    };
</script>

<h2>
    <a href={urlReturnPath()}>
        <CheveronLeftIcon />
    </a>
    <span>SCR record detail</span>
</h2>

{#if data}
    <div>
        <div>
            <Form {data}>
                <p slot="intro">Edit SCR record.</p>

                <div slot="form">
                    <SCRComponent bind:data />
                </div>


                <div slot="controls">
                    <button on:click={handleSave}>Save</button>
                </div>
            </Form>
        </div>
        <div style="width:30px;">
            <!-- 3D Viewer code copied from
                https://dev.to/alexwarnes/svelte-cubed-loading-your-gltf-models-14lf
                https://svelte.dev/repl/8ea0488302bb434991cc5b82f653cdb5?version=3.48.0
            -->
            <SC.Canvas
                background={new THREE.Color("skyblue")}
                antialias
            >

            <SC.PerspectiveCamera
                position={[-10, 36, 20]}
                near={0.1}
                far={500}
                fov={40}
            />
            <SC.OrbitControls
                enabled={true}
                enableZoom={true}
                autoRotate={false}
                autoRotateSpeed={2}
                enableDamping={true}
                dampingFactor={0.1}
                target={[-6, 17, 0]}
            />
            <SC.DirectionalLight
                color={new THREE.Color(0xffffff)}
                position={[0,10,10]}
                intensity={0.75}
                shadow={false}
            />
            <SC.AmbientLight
                color={new THREE.Color(0xffffff)}
                intensity={0.75}
            />

            <ReusableGLTF
                modelURL={modelURL['littleCity']}
                name="littleCity"
                scale={[.05,.05,.05]}
                on:statusChange={handleViewerStatusChange}
            />

            </SC.Canvas>
            <Loading showLoading={$modelsLoading} />
        </div>

    </div>


    <button on:click={handleDelete}>Delete</button>
{/if}




