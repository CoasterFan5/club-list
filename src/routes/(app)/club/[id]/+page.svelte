<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<div class="wrap">
	<h1>{data.club.name}</h1>
</div>

<style>
	.wrap {
		height: 100%;
		width: 100%;
		box-sizing: border-box;
		padding: 1rem 5rem;
		display: flex;
		flex-direction: row;
		align-items: start;
		justify-content: center;
	}
</style>
