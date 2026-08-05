<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import { base } from '$app/paths';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<nav class="top-nav">
	<a class="brand" href="{base}/">Quiz Lab</a>
	<a class="github" href="https://github.com/routeburn-alpha/product-demo-template" rel="noopener" target="_blank">View on GitHub</a>
</nav>

{@render children()}

<style>
	:global(body) {
		margin: 0;
		background: #e8f5e9;
	}

	.top-nav {
		max-width: 880px;
		margin: 0 auto;
		padding: 1rem 2rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
	}

	.brand {
		font-weight: 800;
		font-size: 1rem;
		color: #111;
		text-decoration: none;
		letter-spacing: -0.01em;
	}

	.github {
		font-size: 0.85rem;
		color: #666;
		text-decoration: none;
	}

	.github:hover {
		color: #1d4ed8;
	}
</style>
