<script lang="ts">
	import Button from "$lib/components/Button.svelte";
	import Input from "$lib/components/Input.svelte";
	import MdEditor from "$lib/components/MdEditor.svelte";
	import type { PageData } from "./$types";

	let content = "No Description"
</script>

<div class="wrap">
	<form class="editor" method="post" action="?/createAnnouncement">
		<Input label="title" name="title" bgColor="var(--bg)" />
		<MdEditor bind:content editable={true}/>
		<hr>
		<input name="desc" style="display: none" bind:value={content}/>
		<Button value="Create" type="submit"/>
	</form>
</div>


<style>
	.wrap {
		display: flex;
		width: 100%;
		height: 100%;
		padding: 50px 0px;
		flex-direction: column;
		align-items: center;
		justify-content: start;
	}
	.editor {
		width: 90%;
		max-width: 500px;
	}
	hr {
		padding: 0px;
		margin: 7px 0px;
		border: 0px;
	}
</style>




