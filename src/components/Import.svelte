<script>
    export let authStore;
    export let postFileFunction;
    export let propertyMissingMessage;
    export let propertyElement;
    export let url;

    let dropEnabled = true;
    let protocol = [];

    function handleDropOver(event) {
        event.preventDefault();
    }

    function handleDrop(event) {
        event.preventDefault();

        if (event.dataTransfer.items) {
            dropEnabled = false;

            for (const file of event.dataTransfer.files) {
                uploadFile(file);
            }
        }
        dropEnabled = true;
    }

    function handleFileInput(event) {
        if (event.target.files) {
            dropEnabled = false;

            for (const file of event.target.files) {
                uploadFile(file);
            }
        }
        dropEnabled = true;
    }

    function uploadFile(file) {
        if (!propertyElement.checkValidity()) {
            output(propertyMissingMessage);
            return;
        }

        if (file.type === 'application/json') {
            authStore
                .getToken()
                .then((token) => postFileFunction(url, propertyElement.value, file, token))
                .then((response) => output(`${file.name} uploaded - ${response}`))
                .catch((error) => output(`${file.name} not uploaded - ${error}`));
        } else {
            output('Only .json files accepted');
        }
    }

    function output(message) {
        protocol = [message, ...protocol];
    }
</script>

<h2>Import Services</h2>

<slot name="intro" />

<slot name="search" />

<div id="dropzone" class:disabled={!dropEnabled} on:drop={handleDrop} on:dragover={handleDropOver}>
    <span>Drop .json files</span>
    <button disabled={!dropEnabled}>
        <label for="fileinput">Select from Drive</label>
        <input id="fileinput" type="file" disabled={!dropEnabled} accept=".json" on:change={handleFileInput} />
    </button>
</div>

<div id="protocol">
    {#each protocol as item}
        <div>{item}</div>
    {/each}
</div>

<!--
    (c) 2020 Open AR Cloud
    This code is licensed under MIT license (see LICENSE.md for details)
-->

<style>
    #dropzone {
        height: 15rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 2rem;
        border: 5px dashed darkgray;
    }

    #dropzone.disabled {
        border-color: lightgray;
        color: lightgray;
    }

    #dropzone button {
        max-width: 15rem;
        margin: auto;
        padding: 2rem;
    }

    input[type='file'] {
        display: none;
    }

    /* eslint-disable-next-line css-unused-selector */
    #search {
        margin-top: 2rem;
    }

    #protocol {
        min-height: 5rem;
        margin: 2rem;
        padding: 5px;
        border: 1px solid darkgray;
    }
</style>
