<script lang="ts">
	import '@fontsource/work-sans/100.css';
	import '@fontsource/work-sans/200.css';
	import '@fontsource/work-sans/300.css';
	import '@fontsource/work-sans/400.css';
	import '@fontsource/work-sans/500.css';
	import '@fontsource/work-sans/600.css';
	import '@fontsource/work-sans/700.css';
	import '@fontsource/work-sans/800.css';
	import '@fontsource/work-sans/900.css';
	import '@fontsource-variable/source-code-pro';
	import Footer from '$lib/modules/Footer.svelte';
	import Navbar from '$lib/modules/Navbar.svelte';
</script>

<div class="wrap">
	<Navbar />
	<div class="content">
		<div class="wrapper">
			<slot />
		</div>
		<div class="footer">
			<Footer />
		</div>
	</div>
</div>

<style lang="scss">
	.footer {
		position: absolute;
		height: 120px;
		width: 100%;
		bottom: -0px;
	}

	.wrap {
		min-height: calc(100vh);
		width: 100%;
		display: flex;
		flex-direction: column;
	}

	.wrapper {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		flex-direction: column;
	}

	.content {
		position: relative;
		box-sizing: border-box;
		width: 100%;
		min-height: calc(100vh - 60px);
		padding-bottom: 120px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: start;
	}
</style>
