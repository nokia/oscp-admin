<!--
  (c) 2020 Open AR Cloud
  This code is licensed under MIT license (see LICENSE.md for details)
-->

<script>
    import { goto } from '@sveltech/routify';

    import { geoPose } from '../../../../core/store';

    import Modal from '../../../../components/Modal.svelte';
    import Map from '../../../../components/Map.svelte';

    let showModal = false;

    function gotoCheckContent(event) {
        geoPose.update((pose) => {
            pose.position.lat = event.detail.lat;
            pose.position.lon = event.detail.lon;
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
