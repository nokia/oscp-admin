<!--
    (c) 2020 Open AR Cloud
    This code is licensed under MIT license (see LICENSE.md for details)
-->

<script>
    export let key
    export let value
</script>

<style>
    span {
        padding: 0 0 0 1.5em;
        background: 0 0.1em no-repeat;
        background-size: 1em 1em;
        background-image: url(/value.svg)
    }
</style>

<span>{key}: {value}</span>