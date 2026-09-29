<!--
  (c) 2020 Open AR Cloud, This code is licensed under MIT license (see LICENSE.md for details)
  (c) 2024 Nokia, Licensed under the MIT License, SPDX-License-Identifier: MIT
-->

<script lang="ts">
    import type { BBox, BBox2d, BBox3d, Position } from '@oarc/ssd-access';
    import type { ChangeEventHandler } from 'svelte/elements';

    export let data: BBox | undefined;
    export let coordinates: Position[] = [];

    $: finiteCorners = openRing(coordinates.filter((position) => position.length >= 2 && Number.isFinite(position[0]) && Number.isFinite(position[1])));

    function openRing(positions: Position[]): Position[] {
        if (positions.length < 2) {
            return positions;
        }
        const first = positions[0];
        const last = positions[positions.length - 1];
        if (first[0] === last[0] && first[1] === last[1]) {
            return positions.slice(0, -1);
        }
        return positions;
    }

    function calculateBbox(event: Event) {
        event.preventDefault();
        // Planar min/max of longitude and latitude. This is not a spherical bounding box:
        // a polygon across the antimeridian or over a pole needs care, because the box can span the long way around.
        if (finiteCorners.length < 3) {
            return;
        }

        const west = Math.min(...finiteCorners.map((position) => position[0]));
        const south = Math.min(...finiteCorners.map((position) => position[1]));
        const east = Math.max(...finiteCorners.map((position) => position[0]));
        const north = Math.max(...finiteCorners.map((position) => position[1]));
        const altitudes = finiteCorners.map((position) => position[2]).filter((altitude): altitude is number => Number.isFinite(altitude));

        // GeoJSON stores every minimum before every maximum:
        // [west, south, east, north], or [west, south, min altitude, east, north, max altitude].
        if (altitudes.length > 0) {
            data = [west, south, Math.min(...altitudes), east, north, Math.max(...altitudes)];
            return;
        }

        data = [west, south, east, north];
    }

    const toggleBbox: ChangeEventHandler<HTMLInputElement> = (event) => {
        if (event.currentTarget.checked) {
            data = [0, 0, 0, 0];
        } else {
            data = undefined;
        }
    };

    const toggleAltitude: ChangeEventHandler<HTMLInputElement> = (event) => {
        if (!data) {
            return;
        }

        if (event.currentTarget.checked && data.length === 4) {
            const box: BBox3d = [data[0], data[1], 0, data[2], data[3], 0];
            data = box;
            return;
        }

        if (!event.currentTarget.checked && data.length === 6) {
            const box: BBox2d = [data[0], data[1], data[3], data[4]];
            data = box;
        }
    };
</script>

<dl>
    <dt>
        <input type="checkbox" checked={data !== undefined} on:change={toggleBbox} />
        <span>BBox</span>
        <button type="button" disabled={finiteCorners.length < 3} on:click={calculateBbox}>Calculate bounding box</button>
    </dt>
    {#if data}
        <dd class="edges">
            <span>
                <label for="bbox-west">West</label>
                <input id="bbox-west" type="number" step="any" required bind:value={data[0]} />
            </span>
            <span>
                <label for="bbox-south">South</label>
                <input id="bbox-south" type="number" step="any" required bind:value={data[1]} />
            </span>
            {#if data.length === 6}
                <span>
                    <label for="bbox-east">East</label>
                    <input id="bbox-east" type="number" step="any" required bind:value={data[3]} />
                </span>
                <span>
                    <label for="bbox-north">North</label>
                    <input id="bbox-north" type="number" step="any" required bind:value={data[4]} />
                </span>
            {:else}
                <span>
                    <label for="bbox-east">East</label>
                    <input id="bbox-east" type="number" step="any" required bind:value={data[2]} />
                </span>
                <span>
                    <label for="bbox-north">North</label>
                    <input id="bbox-north" type="number" step="any" required bind:value={data[3]} />
                </span>
            {/if}
        </dd>
        <dd>
            <label>
                <input type="checkbox" checked={data.length === 6} on:change={toggleAltitude} />
                <span>Altitude</span>
            </label>
        </dd>
        {#if data.length === 6}
            <dd class="edges">
                <span>
                    <label for="bbox-min-h">Min altitude</label>
                    <input id="bbox-min-h" type="number" step="any" required bind:value={data[2]} />
                </span>
                <span>
                    <label for="bbox-max-h">Max altitude</label>
                    <input id="bbox-max-h" type="number" step="any" required bind:value={data[5]} />
                </span>
            </dd>
        {/if}
    {/if}
</dl>

<style>
    button {
        margin-left: 1rem;
    }

    .edges {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem 1.25rem;
    }
</style>
