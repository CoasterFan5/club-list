<script>
	import Button from '$lib/components/Button.svelte';

	export let data;
</script>

<div class="wrap">
	<h2>Roles</h2>
	{data.roles.length}
	<Button value="Create Role" />
</div>

<style>
	.wrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;
		box-sizing: border-box;
	}
</style>
