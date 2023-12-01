<script lang="ts">
	import type { LayoutData } from "./$types";
	import Sidebar from "./Sidebar.svelte";
	export let data: LayoutData;
</script>


<div class="wrap">
	<Sidebar {data}/>
	<div class="content">
		<slot/>
	</div>
</div>

<style>
	.wrap {
		display: flex;
		flex-direction: row;
		width: 100%;
		height: 100vh;
	}
	.content {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: start;
		flex-direction: column;
		height: 100vh;
		overflow: auto;
	}
</style>