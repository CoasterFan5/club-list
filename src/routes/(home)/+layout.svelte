<script>
	import Navbar from '$lib/modules/Navbar.svelte';
</script>

<div class="content">
	<Navbar />
	<slot />
</div>

<style>
	.content {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
</style>
