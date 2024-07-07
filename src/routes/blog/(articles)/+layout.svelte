<script lang="ts">
	import Footer from '$lib/components/home/Footer.svelte';
	import Navbar from '$lib/components/home/Navbar.svelte';
</script>

<Navbar />

<div class="wrap">
	<slot />
</div>

<Footer />

<style lang="scss">
	.wrap {
		margin-top: 60px;

		width: 100%;
		min-height: calc(100vh - 60px);
	}
</style>
