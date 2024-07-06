<script lang="ts">
	import '$lib/articles.scss';

	import { Image } from '@unpic/svelte';

	import ImageAddIcon from '~icons/bx/image-add';
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
	let fileUploadFormButton: HTMLButtonElement;
	let articleContent = data.article?.articleText;

	const submitFileUploadForm = () => {
		fileUploadFormButton.click();
	};
</script>

<svelte:window on:keydown={keybindHelper} />

<div class="wrap">
	<div class="articleEdit">
		<h2>Article Content</h2>
		<div class="inner">
			<MdEditor editable={true} saveable={false} bind:content={articleContent} />
		</div>
		<form
			action="?/save"
			method="post"
			use:enhance={() => {
				return ({ update }) => {
					update({
						reset: false
					});
				};
			}}
		>
			<textarea name="content" hidden bind:value={articleContent} />
			<button bind:this={saveButton} hidden type="submit" />
			<Button value="save" />
		</form>
	</div>
	<div class="sideBar">
		<form class="articleInfo" action="?/saveDetails" method="post" use:enhance>
			<h2>Article Info</h2>
			<Input name="name" bg="var(--bgMid)" label="Article Name" value={data.article.articleName} />
			<hr />
			<textarea
				name="description"
				placeholder="Short article description."
				value={data.article.articleDescription}
			/>
			<hr />
			<Button value="save" />
		</form>
		<div class="articleInfo">
			<h2>Image Bank</h2>
			<p>Add New</p>
			<form
				class="imageUpload"
				action="?/uploadImage"
				enctype="multipart/form-data"
				method="post"
				use:enhance
			>
				<label>
					<span class="icon">
						<ImageAddIcon />
					</span>
					<input
						name="image"
						accept="image/*"
						hidden
						type="file"
						on:input|preventDefault={submitFileUploadForm}
					/>
				</label>
				<button bind:this={fileUploadFormButton} hidden type="submit" />
			</form>

			<p>Existing</p>
			{#each data.article.images as image}
				<div class="displayedImage">
					<Image alt="image" height={250} layout="constrained" src={image.key} width={500} />
				</div>
			{/each}
		</div>
	</div>
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

	.sideBar {
		max-width: 20rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		justify-content: center;
	}

	.articleInfo {
		width: 100%;

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

	.imageUpload {
		all: unset;
		width: 100%;
		aspect-ratio: 2/1;
		background: var(--text);
		border-radius: 0.25rem;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;

		.icon {
			font-size: 2rem;
		}
		&:hover {
			background: var(--bgPure);
		}
	}

	.displayedImage {
		width: 100%;
		overflow: hidden;
		outline: 1px solid var(--accent50);
		border-radius: 0.5rem;
		aspect-ratio: 2/1;
		display: flex;
		margin-bottom: 1rem;
		align-items: center;
		justify-content: center;
	}
</style>
