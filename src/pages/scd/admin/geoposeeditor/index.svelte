<!--
  (c) 2020 Open AR Cloud, This code is licensed under MIT license (see LICENSE.md for details)
  (c) 2024 Nokia, Licensed under the MIT License, SPDX-License-Identifier: MIT
-->

<script lang="ts">
    import { goto } from '@sveltech/routify';

    import { geoPose } from '../../../../core/store';

    import Modal from '../../../../components/Modal.svelte';
    import Map from '../../../../components/Map.svelte';
    import type { H3IndexInput } from 'h3-js';

    let showModal = false;

    function gotoCheckContent(event: { detail: { lat: number; lon: number; h3: H3IndexInput } }) {
        geoPose.update((pose) => {
            if (pose) {
                pose.position.lat = event.detail.lat;
                pose.position.lon = event.detail.lon;
                pose.h3 = event.detail.h3;
            } else {
                pose = { position: { lat: event.detail.lat, lon: event.detail.lon, h: 0 }, quaternion: { x: 0, y: 0, z: 0, w: 1 }, h3: event.detail.h3 };
            }
            return pose;
        });

        $goto('checkcontent');
    }
</script>

<Map on:goto-checkcontent={gotoCheckContent} />

{#if showModal}
    <Modal on:close={() => (showModal = false)}>
        <h2 slot="header">Placeholder Title</h2>

        <main>// TODO: define content when modal is needed</main>
    </Modal>
{/if}
