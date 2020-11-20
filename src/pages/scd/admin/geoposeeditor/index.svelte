<!--
  (c) 2020 Open AR Cloud
  This code is licensed under MIT license (see LICENSE.md for details)
-->

<script>
    import { goto } from '@sveltech/routify';

    import { geoPose } from "../../../../core/store";

    import Modal from '../../../../components/Modal.svelte';
    import Map2D from '../../../../components/Map2D.svelte';

    let showModal = false;

    function gotoCheckContent(event) {
        geoPose.update((pose) => {
            pose.latitude = event.detail.lat;
            pose.longitude = event.detail.lon;
            pose.h3 = event.detail.h3;
            return pose;
        })

        $goto('checkcontent')
    }
</script>


<Map2D on:goto-checkcontent={gotoCheckContent} />



{#if showModal}
    <Modal on:close="{() => showModal = false}">
        <h2 slot="header">Placeholder Title</h2>

        <main>
            // TODO: define content when modal is needed
        </main>
    </Modal>
{/if}
