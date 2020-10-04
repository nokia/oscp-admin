<!--
    (c) 2020 Open AR Cloud
    This code is licensed under MIT license (see LICENSE.md for details)
-->

<script>
    import Content from './Content.svelte';
    import GeoPose from './GeoPose.svelte';

    export let data;
</script>


<fieldset>
    <legend>Content</legend>

    <Content data="{data.content}" />
</fieldset>

<fieldset>
    <legend>GeoPose</legend>

    <GeoPose data="{data.content.geopose}" />
</fieldset>
