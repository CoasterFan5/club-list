<script lang="ts">
	import Input from "$lib/components/Input.svelte"
	import type {PageData} from "./$types"
	export let data: PageData;

</script>

<div class="wrap">
	<h2>General Settings</h2>
	<hr>
	<div class="itemSpacer">
		<Input name="name" label="Name" value={data.org.name}/>
	</div>
	
</div>


<style>
	.wrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;
		max-width: 500px;

	}
	h2 {
		margin: 0px;
	}
	.itemSpacer {
		width: 100%;
		padding: 7px 0px;
	}
</style>