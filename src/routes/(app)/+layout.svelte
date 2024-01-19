<script lang="ts">
	import { cubicIn, cubicOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';

	import type { LayoutData } from './$types';
	import Sidebar from './Sidebar.svelte';

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
		<div class="content" in:fade={transitionIn} out:fade={transitionOut}>
			<slot />
		</div>
	{/key}
</div>

<style lang="scss">
	.wrap {
		display: flex;
		flex-direction: row;
		width: 100%;
		height: 100vh;
	}

	.content {
		width: calc(100% - 75px);
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
