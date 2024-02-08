<!-- 3D Viewer code copied from https://svelte.dev/repl/8ea0488302bb434991cc5b82f653cdb5?version=3.48.0 -->
<script lang="ts">
    import * as SC from 'svelte-cubed';
    import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';

    // Component Props
    export let modelURL: string;
    export let scale: SC.Scale = [1, 1, 1];
    export let position: SC.Position = [0, 0, 0];
    export let rotation: SC.Rotation = [0, 0, 0];

    let model: GLTF | null = null;

    // 	Custom Event to track loading status from parent
    function loadGLTF() {
        const loader = new GLTFLoader();
        return loader.loadAsync(modelURL);
    }

    $: {
        if (modelURL) {
            loadGLTF()
                .then((_model) => {
                    model = _model;
                })
                .catch((err) => {});
        }
    }
</script>

{#if model}
    <SC.Primitive object={model.scene} {scale} {position} {rotation} />
{/if}
