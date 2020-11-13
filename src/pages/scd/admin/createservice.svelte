<!--
    (c) 2020 Open AR Cloud
    This code is licensed under MIT license (see LICENSE.md for details)
-->

<script>
    import {scr_empty, validateScr, postService} from 'scd-access';
    import { authStore } from 'scd-access/authstore.js'

    import { goto, params } from '@sveltech/routify';

    import deepMerge from 'deepmerge';

    import Form from '../../../components/Form.svelte';
    import Topic from '../../../components/scd/Topic.svelte';
    import SCR from '../../../components/scd/SCR.svelte';


    let form;
    let topicElement;

    let data = JSON.parse(JSON.stringify(scr_empty));
    let selection = $params.selection;

    if (selection !== undefined && selection.length > 2) {
        // TODO: Remove the data from the browser location
        data = deepMerge(data, JSON.parse(selection));
    }

    function save(event) {
        event.preventDefault();

        if (!form.reportValidity()) {
            event.preventDefault();
            console.log(`New SCR not sent - Form invalid`);

            return;
        }

        const dataString = JSON.stringify(data);
        validateScr(dataString)
            .then(() => authStore.getToken())
            .then(token => postService(topicElement.value(), dataString, token))
            .then((response) => {
                console.log(response);
                $goto('/scd');
            })
            .catch(error => {
                console.log(`New SCR not sent - ${error}`);
            });
    }
</script>


<h2>Create Spatial Service</h2>

<Form bind:data bind:this={form}>
    <p slot="intro">Enter data for new SCR record.</p>

    <div slot="extras">
        <Topic bind:this={topicElement} />
    </div>

    <div slot="form">
        <SCR bind:data={data} />
    </div>

    <div slot="controls">
        <button on:click={save}>Save</button>
        <button type="reset">Reset</button>
    </div>
</Form>
