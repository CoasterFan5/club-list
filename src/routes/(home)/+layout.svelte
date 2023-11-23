<script>
	import Footer from '$lib/modules/Footer.svelte';
	import Navbar from '$lib/modules/Navbar.svelte';
</script>

<div class="content">
	<Navbar />
	<slot />
</div>
<Footer />

<style>
	.content {
		width: 100%;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
</style>
