<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import MdEditor from '$lib/components/editor/MdEditor.svelte';
	import Input from '$lib/components/Input.svelte';
	import { handleForm } from '$lib/utils/formToaster';

	export let data;
	export let form;

	$: handleForm(form);

	let saveButton: HTMLButtonElement;

	const keybindHelper = (e: KeyboardEvent) => {
		if (e.key == 's' && e.ctrlKey) {
			e.preventDefault();
			saveButton.click();
		}
	};

	let articleContent = data.article?.articleText;
</script>

<svelte:window on:keydown={keybindHelper} />

<div class="wrap">
	<div class="articleEdit">
		<h2>Article Content</h2>
		<div class="inner">
			<MdEditor editable={true} saveable={false} bind:content={articleContent} />
		</div>
		<form action="?/save" method="post" use:enhance>
			<textarea name="content" hidden bind:value={articleContent} />
			<button bind:this={saveButton} hidden type="submit" />
			<Button value="save" />
		</form>
	</div>
	<form class="articleInfo" action="?/saveDetails" method="post" use:enhance>
		<h2>Article Info</h2>
		<Input name="name" bg="var(--bgMid)" label="Article Name" value={data.article?.articleName} />
		<hr />
		<textarea
			name="description"
			placeholder="Short article description."
			value={data.article?.articleDescription}
		/>
		<hr />
		<Button value="save" />
	</form>
</div>

<style lang="scss">
	.wrap {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: start;
		justify-content: center;
		padding: 1rem 0rem;
		flex-direction: row;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.articleEdit {
		width: 100%;
		max-width: 75ch;
		padding: 2.5ch;
		height: 100%;
		background: var(--bgMid);
		border-radius: 0.5rem;
		box-sizing: border-box;
		margin-bottom: 1rem;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;

		h2 {
			margin: 0;
			margin-bottom: 1rem;
		}
	}

	.inner {
		width: 100%;
		margin-bottom: 1rem;
	}

	.articleInfo {
		width: 100%;
		max-width: 20rem;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		background: var(--bgMid);
		padding: 1rem;
		box-sizing: border-box;

		hr {
			border: 0px;
			margin: 7px 0;
		}
	}

	textarea {
		width: 100%;
		resize: vertical;
		padding: 0.5rem;
		box-sizing: border-box;
		outline: 0px;
		border: 1px solid gray;
		border-radius: 3px;
		font-family:
			Work Sans,
			sans-serif;

		&:focus,
		&:active {
			border: 1px solid var(--accent);
		}
	}
</style>
