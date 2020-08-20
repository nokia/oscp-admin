<!--
    (c) 2020 Open AR Cloud
    This code is licensed under MIT license (see LICENSE.md for details)
-->

<script>
    import { params, url, route } from '@sveltech/routify';

    console.log($params);
</script>

<h2>
    {#if $route.last}
    <a href="{$url($route.last.path)}"><img alt="back navigation arrow" src="/arrow_back_ios-24px.svg"/></a>
    {/if}
    <span>Content {$params.id} detail</span>
</h2>