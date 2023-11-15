<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<div class="wrap">
	<div class="header">
		<h1 class="title">{data.club.name}</h1>
	</div>

	
</div>

<style>
	.wrap {
		height: 100%;
		width: 100%;
		box-sizing: border-box;
		padding: 1rem 5rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: start;
	}
	.header {
		position: relative;
		width: 100%;
		aspect-ratio: 3/1;
		border-radius: 15px;
		overflow: hidden;

	}
	
	.title {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 3rem;
		margin: 0px;
		background: rgba(255, 255, 255, 0.75);
	}
</style>
