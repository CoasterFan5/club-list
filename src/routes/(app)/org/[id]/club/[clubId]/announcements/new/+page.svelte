<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import MdEditor from '$lib/components/MdEditor.svelte';

	let content = 'No Description';
</script>

<div class="wrap">
	<form class="editor" action="?/createAnnouncement" method="post" use:enhance>
		<Input name="title" bgColor="var(--bg)" label="Title" />
		<MdEditor editable={true} bind:content />
		<hr />
		<input name="desc" style="display: none" bind:value={content} />
		<Button type="submit" value="Create" />
	</form>
</div>

<style lang="scss">
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
