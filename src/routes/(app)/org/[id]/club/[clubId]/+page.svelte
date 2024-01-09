<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import MdEditor from '$lib/components/editor/MdEditor.svelte';
	import { enhance } from '$app/forms';
	import { closeModal } from '$lib/closeModalEnhance';
	import { addToast } from '$lib/components/toaster';
	export let data: PageData;
	export let form: ActionData;

	let clubDescription = data.club.description || '<h1>No description yet :(</h1>';
	let editing = false;
	let saveMdButton: HTMLButtonElement;

	let toggleEdit = () => (editing = !editing);

	$: if (form) {
		if (form.success) {
			addToast({
				type: 'success',
				message: 'Club Updated!',
				life: 3000
			});
		} else {
			addToast({
				type: 'error',
				message: form.message || 'An error occurred!',
				life: 3000
			});
		}
	}
</script>

<div class="wrap">
	<div class="content">
		<div class="editor">
			<MdEditor
				editable={data.clubPerms.admin || data.clubPerms.updateDescription}
				bind:content={clubDescription}
				on:saveRequest={() => {
					saveMdButton.click();
				}}
			/>
			<form action="?/updateClub" hidden method="post" use:enhance>
				<input name="clubDescription" value={clubDescription} />
				<button bind:this={saveMdButton} type="submit" />
			</form>
		</div>
	</div>
	<div class="announcements">
		<h2>Recent Announcements</h2>
	</div>
</div>

<style lang="scss">
	.wrap {
		height: 100%;
		width: 100%;
		box-sizing: border-box;
		padding-top: 1rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: start;
	}

	.announcements {
		margin-top: 2rem;
	}

	.content {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: start;
		justify-content: center;
	}

	.editor {
		position: relative;
		width: 100%;
		height: 100%;
	}

	.editTools {
		position: absolute;
		top: 32px;
		right: 0px;
		z-index: 100;

		img {
			aspect-ratio: 1/1;
		}
	}
	.editButton {
		all: unset;
		display: flex;
		width: 32px;
		height: 32px;
		cursor: pointer;
	}
</style>
