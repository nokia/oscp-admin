<!--
    (c) 2020 Open AR Cloud
    This code is licensed under MIT license (see LICENSE.md for details)
-->

<script lang="ts">
    import type { Geometry } from '@oarc/ssd-access';
    import BoundingBox from './BoundingBox.svelte';
    import Coordinate from './Coordinate.svelte';

    export let data: Geometry;
</script>

<details>
    <summary>{data.type}</summary>

    <Coordinate bind:data={data.coordinates[0]} />
    <BoundingBox bind:data={data.bbox} />
</details>
