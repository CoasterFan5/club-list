<script lang="ts">
	import type { LayoutData } from './$types';
	import Sidebar from './Sidebar.svelte';
	import { fade, fly } from 'svelte/transition';
	import { cubicIn, cubicOut } from 'svelte/easing';

	export let data: LayoutData;

	const duration = 200;
	const delay = duration + 75;
	const y = 5;

	const transitionIn = { easing: cubicOut, y, duration, delay };
	const transitionOut = { easing: cubicIn, y: -y, duration };
</script>

<div class="wrap">
	<Sidebar {data} />
	{#key data.pathType}
		<div in:fade={transitionIn} out:fade={transitionOut} class="content">
			<slot />
		</div>
	{/key}
</div>

<style>
	.wrap {
		display: flex;
		flex-direction: row;
		width: 100%;
		height: 100vh;
	}
	.content {
		width: calc(100%);
		margin-left: 75px;
		display: flex;
		position: absolute;
		align-items: center;
		justify-content: start;
		flex-direction: column;
		height: 100vh;
		overflow: auto;
	}
</style>
