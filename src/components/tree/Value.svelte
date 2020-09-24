<!--
    (c) 2020 Open AR Cloud
    This code is licensed under MIT license (see LICENSE.md for details)
-->

<script context="module">
    let counter = 0;
</script>

<script>
    export let key
    export let value
    export let required;

    const inputId = counter++;


    function getInputType() {
        let inputType;

        switch (value.type) {
            case 'string':
                inputType = 'text';
                break;
            default:
                inputType = value.type;
        }

        return inputType;
    }

    function getRequired() {
        return required.includes(key) ? 'required' : '';
    }
</script>

<style>
    span {
        padding: 0 0 0 1.5em;
        background: 0 0.1em no-repeat;
        background-size: 1em 1em;
        background-image: url(/value.svg)
    }
</style>

{#if ('const' in value || ('$form' in value && value.$form.type === 'nonedit'))}
    <div>{key}: {value.default}</div>
{:else}
    <label for="editvalue{inputId}">{key}: </label>
    <input id="editvalue{inputId}" type="{getInputType()}" required="{getRequired()}" value={value.default} />
{/if}