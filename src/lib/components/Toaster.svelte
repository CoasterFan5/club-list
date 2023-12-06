<script lang="ts">
	import { flip } from 'svelte/animate';
	import Toast from './Toast.svelte';
	import { toasts } from './toaster';
	import { cubicInOut } from 'svelte/easing';
</script>

<div class="wrap">
	{#each $toasts as toast (toast.id)}
		<div animate:flip={{ duration: 500, easing: cubicInOut }}>
			<Toast data={toast} />
		</div>
	{/each}
</div>

<style lang="scss">
	.wrap {
		position: fixed;
		bottom: 0px;
		right: 0px;
		display: flex;
		flex-direction: column-reverse;
		margin: 10px;
		z-index: 999;
	}
</style>
