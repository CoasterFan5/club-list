<script lang="ts">
	export let showing = false;

	let bgDiv: HTMLButtonElement;

	let modelClickHelper = (e: MouseEvent) => {
		if (e.target === bgDiv) {
			showing = false;
		}
	}
</script>



<button class="wrap" bind:this={bgDiv} on:click={modelClickHelper}>
	<slot />
</button>

<style>
	.wrap {
		width: 100%;
		height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(5px);
	}
</style>