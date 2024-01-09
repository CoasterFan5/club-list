<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import MdEditor from '$lib/components/editor/MdEditor.svelte';

	let content = 'No Description';
</script>

<div class="wrap">
	<form class="editor" action="?/createAnnouncement" method="post" use:enhance>
		<div>
			<div class="input">
				<Input name="title" label="Title" />
			</div>
			<MdEditor editable saveable={false} bind:content />
			<hr />
			<input name="desc" style="display: none" bind:value={content} />
			<Button type="submit" value="Create" />
		</div>
	</form>
</div>

<style lang="scss">
	.wrap {
		display: flex;
		width: 100%;
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

	.input {
		margin-bottom: 1rem;
	}
</style>
