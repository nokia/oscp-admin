<!--
  (c) 2020 Open AR Cloud, This code is licensed under MIT license (see LICENSE.md for details)
  (c) 2024 Nokia, Licensed under the MIT License, SPDX-License-Identifier: MIT
-->

<script lang="ts">
    import { url, route, goto } from '@sveltech/routify';

    import { CheveronLeftIcon } from 'svelte-zondicons';
    import type { MouseEventHandler } from 'svelte/elements';
    let storageProvider: any;

    let returnPath = ($route as any).last ? `${($route as any).last.path}?${new URLSearchParams(($route as any).last.params)}` : 'scd/admin/createservice';

    const selectGDrive: MouseEventHandler<HTMLButtonElement> = (event) => {
        event.currentTarget.setAttribute('active', 'active');

        import('../../../../components/scd/storageprovider/GCloud.svelte')
            .then((result) => {
                storageProvider = result.default;
            })
            .catch((error) => console.log(`Storage service not loaded: ${error}`));
    };

    function handleSelected(event: { detail: { selection: any } }) {
        storageProvider = undefined;

        const selection = event.detail.selection;
        back(selection);
    }

    function handleCanceled() {
        storageProvider = null;

        back();
    }

    function back(selection = []) {
        $goto(returnPath, { selection: JSON.stringify(selection) });
    }

    const urlReturnPath = (): any => {
        return $url(returnPath);
    };
</script>

<h2>
    <a href={urlReturnPath()}>
        <CheveronLeftIcon />
    </a>
    <span>Content select / upload</span>
</h2>

<p>Using Google Drive Picker here as an example for a file selector / uploader to manage online assets. Any other storage service with Javascript client sdk could be implemented here.</p>
<p>
    Right now, selecting a file or files in the picker helps to fill the form fields for the content. The main advantage could be to add some additional processing to the files uploaded, or specific
    validations to check for potential improvements to improve the usability of the file in an AR Cloud experience.
</p>

<ul id="selector">
    <li>
        <button on:click={selectGDrive}>
            <img src="/cloudserviceicons/icons8-google-drive.svg" alt="Google Drive storage service icon" />
        </button>
    </li>
    <li>
        <button disabled>
            <img src="/cloudserviceicons/icons8-pcloud.svg" alt="pCloud storage service icon" />
        </button>
    </li>
    <li>
        <button disabled>
            <img src="/cloudserviceicons/icons8-adobe-creative-cloud.svg" alt="Adobe creative cloud service icon" />
        </button>
    </li>
    <li>
        <button disabled>
            <img src="/cloudserviceicons/icons8-azure-storage.svg" alt="Azure storage service icon" />
        </button>
    </li>
    <li>
        <button disabled>
            <img src="/cloudserviceicons/icons8-baidu-cloud.svg" alt="Azure storage service icon" />
        </button>
    </li>
    <li>
        <button disabled>
            <img src="/cloudserviceicons/icons8-box.svg" alt="Box storage service icon" />
        </button>
    </li>
</ul>

<svelte:component this={storageProvider} on:selected={handleSelected} on:canceled={handleCanceled} />

<!--
    (c) 2020 Open AR Cloud
    This code is licensed under MIT license (see LICENSE.md for details)
-->

<style>
    #selector {
        margin-top: 2rem;
        text-align: center;
    }

    #selector li {
        display: inline;
        width: 4rem;
        padding: 5px;
    }

    #selector button:active {
        background-color: lightgreen;
    }

    #selector button[disabled] {
        filter: opacity(25%);
    }

    #selector button[disabled]:active {
        background-color: unset;
    }

    #selector img {
        width: 4rem;
    }
</style>
