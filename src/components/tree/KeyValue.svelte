<!--
    (c) 2020 Open AR Cloud
    This code is licensed under MIT license (see LICENSE.md for details)
-->

<script>
    import Value from './Value.svelte'
    import List from "./List.svelte";

    export let expanded = false
    export let name
    export let schema;
    export let values


    const required = schema.required;

    function toggle() {
        expanded = !expanded
    }

    function getDefinitionSchema(path) {
        return 'definitions' in schema ? schema.definitions[path.split('#')[1]] : undefined;
    }
</script>

<style>
    span {
        padding: 0 0 0 1.5em;
        background: url(/folder.svg) 0 0.1em no-repeat;
        background-size: 1em 1em;
        font-weight: bold;
        cursor: pointer;
    }

    .expanded {
        background-image: url(/folder-open.svg);
    }

    ul {
        padding: 0.2em 0 0 0.5em;
        margin: 0 0 0 0.5em;
        list-style: none;
        border-left: 1px solid #eee;
    }

    li {
        padding: 0.2em 0;
    }
</style>

<span class:expanded on:click={toggle}>{name}</span>

{#if expanded}
    <ul>
        {#each Object.entries(schema.properties) as [key, value]}
            <li>
                {#if value.type === 'array'}
                    {#if 'ref' in value.items}
                        <svelte:self name="{key}" schema="{getDefinitionSchema(value.items.ref)}" values="{value}"/>
                    {:else}
                        <List name="{key}" values="{value}"/>
                    {/if}
                {:else if value.type === 'object'}
                    {#if 'ref' in value.items}
                        <svelte:self name="{key}" schema="{getDefinitionSchema(value.items.ref)}" values="{value}"/>
                    {:else}
<!--                        <svelte:self name="{key}" schema="schema" values="{value}"/>-->
                    {/if}
                {:else}
                    <Value {key} {value} {required} />
                {/if}
            </li>
        {/each}
    </ul>
{/if}