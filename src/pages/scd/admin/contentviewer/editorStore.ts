// 3D Viewer code copied from https://svelte.dev/repl/8ea0488302bb434991cc5b82f653cdb5?version=3.48.0

import { writable, readable, derived } from "svelte/store";

// Contains the status of all models
export const statusOfModels = writable({}); // { uniqueName: "LOADING" | "ERROR" | "SUCCESS" }

// Returns a boolean if any model has a status of loading
export const modelsLoading = derived(statusOfModels, statusObj => {
	return Object.values(statusObj).includes("LOADING");
})

// Updates a model's status based on its unique name
export const updateModelStatus = (name:string, status:string) => {
	statusOfModels.update(current => {
		return {
			...current,
			[name]: status,
		}
	})
}

// List of example model URLs
export const modelURL = {
	littleCity: "https://threejs.org/manual/examples/resources/models/cartoon_lowpoly_small_city_free_pack/scene.gltf",
	mountains: "https://threejs.org/manual/examples/resources/models/mountain_landscape/scene.gltf",
	llama: "https://threejs.org/manual/examples/resources/models/animals/Llama.gltf",
	pug: "https://threejs.org/manual/examples/resources/models/animals/Pug.gltf",
	sheep: "https://threejs.org/manual/examples/resources/models/animals/Sheep.gltf",
};
/*
	Models taken from the threejs examples.
	Little City model created by antonmoek:
	https://sketchfab.com/antonmoek
*/