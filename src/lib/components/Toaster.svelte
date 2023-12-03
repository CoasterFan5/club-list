<script>
	import Toast from './Toast.svelte';
	import { toasts } from './toaster';
</script>

<div class="wrap">
	{#each $toasts as toast}
		<Toast data={toast} />
	{/each}
</div>

<style>
	.wrap {
		position: fixed;
		bottom: 0px;
		right: 0px;
		display: flex;
		flex-direction: column;
		margin: 10px;
	}
</style>
