<script lang="ts">
	import { cubicInOut } from 'svelte/easing';
	import { fade, fly } from 'svelte/transition';

	export let showing = false;

	let bgDiv: HTMLButtonElement;

	let modelClickHelper = (e: MouseEvent) => {
		if (e.target === bgDiv) {
			showing = false;
		}
	};
</script>

{#if showing}
	<button
		transition:fade={{ easing: cubicInOut, duration: 150 }}
		class="wrap"
		bind:this={bgDiv}
		on:mousedown={modelClickHelper}
	>
		<div transition:fly={{ easing: cubicInOut, duration: 300, delay: 50, y: 50 }} class="modalForm">
			<slot />
		</div>
	</button>
{/if}

<style>
	.wrap {
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
		z-index: 100;
		top: 0px;
		left: 0px;
	}

	.modalForm {
		border-radius: 5px;
		padding: 20px;
		background: var(--bgPure);
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}
</style>
