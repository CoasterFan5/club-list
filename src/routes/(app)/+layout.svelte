<script>
	import DashboardNavbar from '$lib/modules/DashboardNavbar.svelte';
</script>

<div class="wrap">
	<DashboardNavbar />
	<slot />
</div>

<style>
	.wrap {
		width: 100%;
		height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: start;
	}
</style>
