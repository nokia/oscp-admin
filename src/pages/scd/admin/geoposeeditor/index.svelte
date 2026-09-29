<!--
  (c) 2020 Open AR Cloud, This code is licensed under MIT license (see LICENSE.md for details)
  (c) 2024 Nokia, Licensed under the MIT License, SPDX-License-Identifier: MIT
-->

<script lang="ts">
    import { geoPose } from '../../../../core/store';

    import Modal from '../../../../components/Modal.svelte';
    import Map from '../../../../components/Map.svelte';

    let showModal = false;

    function updateGeopose({ lat, lon }: { lat: number; lon: number }) {
        geoPose.update((pose) => {
            if (!pose?.position) {
                return pose;
            }
            pose.position.lat = lat;
            pose.position.lon = lon;
            return pose;
        });
    }
</script>

<Map {updateGeopose} onSaveCancel={() => {}} />

{#if showModal}
    <Modal on:close={() => (showModal = false)}>
        <h2 slot="header">Placeholder Title</h2>

        <main>// TODO: define content when modal is needed</main>
    </Modal>
{/if}
