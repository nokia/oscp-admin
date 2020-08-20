<!--
    (c) 2020 Open AR Cloud
    This code is licensed under MIT license (see LICENSE.md for details)
-->

<script>
    import { url, goto } from "@sveltech/routify";

    function handleNewContent() {
        $goto('../new');
    }
</script>

<h2>Spatial Content Discovery</h2>

<label>Your content:</label>
<ul>
    <li><a href="{$url('../12345')}">content 1</a></li>
    <li><a href="{$url('../23456')}">content 2</a></li>
</ul>

<button on:click="{handleNewContent}">New</button>
