<script lang="ts">
	import { cubicInOut } from 'svelte/easing';
	import { fade, fly } from 'svelte/transition';

	export let showing = false;

	let modalClickHelper = () => {
		showing = false;
	};
</script>

{#if showing}
	<button
		on:mousedown|self={modalClickHelper}
		transition:fade={{ easing: cubicInOut, duration: 150 }}
	>
		<div transition:fly={{ easing: cubicInOut, duration: 300, delay: 50, y: 50 }}>
			<slot />
		</div>
	</button>
{/if}

<style lang="scss">
	button {
		all: unset;
		position: fixed;
		width: 100%;
		height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(5px);
		top: 0px;
		left: 0px;
		z-index: 1001;
	}

	div {
		border-radius: 5px;
		padding: 20px;
		background: var(--bgPure);
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}
</style>
