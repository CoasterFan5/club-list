<script lang="ts">
	import Footer from '$lib/components/home/Footer.svelte';
	import Navbar from '$lib/components/home/Navbar.svelte';
</script>

<Navbar />
<div class="wrap">
	<slot />
</div>
<div class="alsoLike">
	<div class="alsoLikeInner">
		<h3>You may also like:</h3>
	</div>
</div>
<Footer />

<style lang="scss">
	.wrap {
		margin-top: 60px;
		padding: 1rem 0px;
		width: 100%;
		min-height: calc(100vh - 60px);
	}

	.alsoLike {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;

		.alsoLikeInner {
			width: 90%;
			border-top: 1px solid var(--textLow);
			padding-top: 1rem;
			margin-top: 1rem;
			display: flex;
			align-items: center;
			justify-content: start;

			h3 {
				font-size: 1.5rem;
				font-weight: 600;
				position: relative;
				padding-left: 0.5rem;
				
				&::after {
					content: "";
					position: absolute;
					left: 0px;
					top: 0px;
					height: 100%;
					width: 0.25rem;
					background: var(--accent);
				}
			}
		}
	}
</style>
