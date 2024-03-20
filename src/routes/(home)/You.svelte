<script lang="ts">
	import Button from '$lib/components/Button.svelte';
</script>

<div class="wrap">
	<div class="content">
		<h2>Ready to streamline clubs?</h2>
		<div class="button">
			<Button href="/get-started" value="Get Started" />
		</div>
	</div>

	<div class="bg"/>
</div>

<style lang="scss">
	h2 {
		text-align: center;
	}

	.wrap {
		width: 100%;
		height: 50vh;
		position: relative;

		z-index: 2;

		.content {
			width: 100%;
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			box-sizing: border-box;
			background: linear-gradient(30deg, transparent, var(--bg));
			z-index: 1;
		}

		.bg {
			content: '';
			left: 0px;
			top: 0px;
			width: 100%;
			height: 100%;
			background-size: 10px 10px;
			background-image: radial-gradient(circle, var(--accent) 1px, rgba(0, 0, 0, 0) 1px);
			position: absolute;
			z-index: -1;
			opacity: 0.25;
		}

		h2 {
			font-weight: 500;
			font-size: 2rem;
		}
	}

	.button {
		max-width: 400px;
		margin: 0 1rem;
	}

	
</style>
