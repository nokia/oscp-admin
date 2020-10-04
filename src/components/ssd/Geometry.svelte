<!--
    (c) 2020 Open AR Cloud
    This code is licensed under MIT license (see LICENSE.md for details)
-->

<script>
    import BoundingBox from './BoundingBox.svelte';
    import Coordinate from './Coordinate.svelte';

    export let data;
</script>


<details>
    <summary>{data.type}</summary>

    <Coordinate bind:data="{data.coordinates[0]}" />
    <BoundingBox bind:data="{data.bbox}" />
</details>

