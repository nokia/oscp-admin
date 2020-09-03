<script>
    import { postSsrFile } from 'ssd-access';
    import { authStore } from '../../core/auth.js';


    let dropEnabled = true;
    let protocol = [];

    let countryCode = 'us';

    function handleDropOver(event) {
        event.preventDefault();
        console.log('drop over')
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
        let message = 'empty';

        if (file.type === 'application/json') {
            authStore.getToken()
                .then(token => postSsrFile(countryCode, file, token))
                .then(response => output(`${file.name} uploaded - ${response}`))
                .catch(error => output(`${file.name} not uploaded - ${error}`))
        } else {
            output('Only .json files accepted');
        }
    }

    function output(message) {
        protocol = [message, ...protocol];
    }
</script>


<style>
    /* Additional styles for dropzone moved to global.css, as they stopped working here */

</style>


<h2>Import Services</h2>

<p>
    Here it is possible to upload Spatial Service Records (SSR) by either dropping .json files onto the drop area or by
    selecting files from drive. The content is validated against a json schema and sent to the regional server of the
    provided region. A protocol of the process is shown below the drop area.
</p>

<div id="search">
    <label for="searchcountry">Region</label>
    <input id="searchcountry" type="text" value="{countryCode}">
</div>

<div id="dropzone" class:disabled={!dropEnabled} on:drop={handleDrop} on:dragover={handleDropOver}>
    <span>Drop .json files</span>
    <button disabled={!dropEnabled}>
        <label for="fileinput">Select from Drive</label>
        <input id="fileinput" type="file" disabled={!dropEnabled} accept=".json" on:change={handleFileInput}/>
    </button>
</div>

<div id="protocol">
    {#each protocol as item}
        <div>{item}</div>
    {/each}
</div>
