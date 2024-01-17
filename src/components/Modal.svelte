<script lang="ts">
    import { createEventDispatcher, onDestroy } from 'svelte';
    import type { KeyboardEventHandler } from 'svelte/elements';

    const dispatch = createEventDispatcher<{ close: undefined }>();
    const close = () => dispatch('close');

    let modal: HTMLDivElement;

    const handle_keydown: KeyboardEventHandler<Window> = (event) => {
        if (event.key === 'Escape') {
            close();
            return;
        }

        if (event.key === 'Tab') {
            const nodes = modal.querySelectorAll<HTMLElement>('*');
            const tabbable = Array.from(nodes).filter((n) => n.tabIndex >= 0);

            let index = tabbable.indexOf(document.activeElement as HTMLElement);
            if (index === -1 && event.shiftKey) index = 0;

            index += tabbable.length + (event.shiftKey ? -1 : 1);
            index %= tabbable.length;

            tabbable[index].focus();
            event.preventDefault();
        }
    };

    const previously_focused = typeof document !== 'undefined' && (document.activeElement as HTMLElement);
    if (previously_focused) {
        onDestroy(() => {
            previously_focused.focus();
        });
    }
</script>

<div class="modal-background" on:click={close}></div>

<div class="modal" role="dialog" aria-modal="true" bind:this={modal}>
    <slot name="header" />
    <div id="enclosing">
        <slot />
    </div>
    <!-- svelte-ignore a11y-autofocus -->
    <button autofocus on:click={close}>Close</button>
</div>

<svelte:window on:keydown={handle_keydown} />

<!--
  (c) 2020 Open AR Cloud
  This code is licensed under MIT license (see LICENSE.md for details)
-->

<style>
    .modal-background {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.3);
        z-index: 1000;
    }

    #enclosing {
        width: calc(100vw - 4em);
        height: calc(100vh - 8em);
    }

    .modal {
        position: fixed;
        left: 50%;
        top: 50%;
        width: calc(100vw - 4em);
        height: calc(100vh - 4em);
        overflow: auto;
        transform: translate(-50%, -50%);
        padding: 0.5em;
        border-radius: 0.5em;
        background: white;
        z-index: 1000;
    }

    button {
        display: block;
        width: 100%;
        margin-top: 1em;
    }
</style>
