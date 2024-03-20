<script lang="ts">
	import dashboardImage from '$lib/images/dashboard.png';
</script>

<div class="wrap">
	<div class="image">
		<img alt="Dashboard" src={dashboardImage} />
	</div>
</div>

<style lang="scss">
	.wrap {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: -20vh;

		.image {
			width: 80%;
			aspect-ratio: 5/2;
			min-width: 300px;
			border: 3px solid var(--accent);
			border-radius: 1rem;
			overflow: hidden;
			box-shadow: 1px 1px 3px 3px rgba(0, 0, 0, 0.1);

			img {
				width: 100%;
				object-fit: fit;
				display: block;
				height: auto;
			}
		}
	}
</style>
