<!--
  (c) 2020 Open AR Cloud, This code is licensed under MIT license (see LICENSE.md for details)
  (c) 2024 Nokia, Licensed under the MIT License, SPDX-License-Identifier: MIT
-->

<script lang="ts">
    import type { BBox, BBox2d, BBox3d } from '@oarc/ssd-access';
    import type { ChangeEventHandler } from 'svelte/elements';

    export let data: BBox | undefined;

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
    </dt>
    {#if data}
        <dd>
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
                    <label for="bbox-min-h">Min altitude</label>
                    <input id="bbox-min-h" type="number" step="any" required bind:value={data[2]} />
                </span>
                <span>
                    <label for="bbox-east">East</label>
                    <input id="bbox-east" type="number" step="any" required bind:value={data[3]} />
                </span>
                <span>
                    <label for="bbox-north">North</label>
                    <input id="bbox-north" type="number" step="any" required bind:value={data[4]} />
                </span>
                <span>
                    <label for="bbox-max-h">Max altitude</label>
                    <input id="bbox-max-h" type="number" step="any" required bind:value={data[5]} />
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
    {/if}
</dl>
