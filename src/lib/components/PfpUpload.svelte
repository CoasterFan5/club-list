<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';

	export let pfpUrl: string | null;

	$: newImageData = pfpUrl || '/upload.svg';

	let fileList: FileList;

	let fileSelector: HTMLInputElement;
	let submitButton: HTMLButtonElement;

	let startUpload = () => fileSelector.click();

	let inputHandler = async () => {
		if (fileSelector.files && fileSelector.files?.length > 0) {
			submitButton.click();
		}
	};
</script>

<form
	action="/profile?/updatePfp"
	enctype="multipart/form-data"
	method="post"
	use:enhance={() => {
		return async ({ result }) => {
			if (result.type != 'success') await applyAction(result);
			else {
				await invalidateAll();
				fileSelector.value = '';
			}
		};
	}}
>
	<button class="wrap" type="button" on:click={startUpload}>
		<img class="pfp" alt="profile" height="120px" src={newImageData} width="120px" />
	</button>
	<input
		bind:this={fileSelector}
		name="pfp"
		accept="image/png, image/jpeg"
		hidden
		type="file"
		bind:files={fileList}
		on:input|preventDefault={inputHandler}
	/>
	<button bind:this={submitButton} hidden type="submit" />
</form>

<style lang="scss">
	.wrap {
		all: unset;
		padding: 0px;
		cursor: pointer;
		outline: 0px;
		border: 0px;
		background: var(--bgPure);
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		margin: 25px;
		border-radius: 1rem;
		aspect-ratio: 1/1;
	}
	img {
		min-width: 120px;
		min-height: 120px;
		width: 120px;
		height: 120px;
		aspect-ratio: 1/1;
		border: 2px solid var(--accent);
		border-radius: 1rem;
		object-fit: cover;
	}
</style>
