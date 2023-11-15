<script lang="ts">
	// why a custom button?
	// keeps everything looking clean
	export let value = 'Button!';
	export let type: HTMLButtonElement['type'] = 'submit';
</script>

<button {type}>
	{value}
</button>

<style>
	button {
		background: transparent;
		border: 1px solid gray;
		border-radius: 3px;
		width: 100%;
		padding: 10px;
		box-sizing: border-box;
		font-size: 1.2rem;
		cursor: pointer;
	}
	button:focus,
	button:hover,
	button:active {
		border: 1px solid #02bfe7;
	}
</style>
