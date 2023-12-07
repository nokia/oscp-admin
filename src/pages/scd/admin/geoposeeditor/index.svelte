<!--
  (c) 2020 Open AR Cloud
  This code is licensed under MIT license (see LICENSE.md for details)
-->

<script lang="ts">
    import { goto } from '@roxi/routify';

    import { geoPose } from '../../../../core/store';

    import Modal from '../../../../components/Modal.svelte';
    import Map from '../../../../components/Map.svelte';
    import type { Pose } from '@oarc/scd-access';

    let showModal = false;

    function gotoCheckContent(event: { detail: { lat: number; lon: number; h3: number } }) {
        geoPose.update((pose) => {
            if (pose.position) {
                pose.position.lat = event.detail.lat;
                pose.position.lon = event.detail.lon;
            } else {
                pose = {
                    ...pose,
                    position: {
                        lat: event.detail.lat,
                        lon: event.detail.lon,
                    },
                };
            }
            pose.h3 = event.detail.h3;
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
