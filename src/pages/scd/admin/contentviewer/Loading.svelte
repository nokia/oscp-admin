<!-- 3D Viewer code copied from https://svelte.dev/repl/8ea0488302bb434991cc5b82f653cdb5?version=3.48.0 -->
<script>
	export let showLoading = false;
</script>

{#if showLoading}
	<div class="loading-container">
		<p>
			Loading...
		</p>
	</div>
{/if}

<style>
	.loading-container {
		position: fixed;
		left: 1rem;
		bottom: 1rem;
		background: #00000088;
		color: #fafbfc;
		padding: .5rem .875rem;
	}

	p {
		margin: 0;
	}
</style>
