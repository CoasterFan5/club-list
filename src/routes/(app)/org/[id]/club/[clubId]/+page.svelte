<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import ModelHelper from '$lib/modules/ModelHelper.svelte';
	import type { ActionData, PageData } from './$types';
	import MdEditor from '$lib/components/MdEditor.svelte';
	import { enhance } from '$app/forms';
	import { addToast } from '$lib/components/toaster';
	import { closeModal } from '$lib/closeModalEnhance';
	export let data: PageData;
	export let form: ActionData;

	let clubDescription = data.club.description || '<h1>No description yet :(</h1>';
	let clubImage = data.club.imageURL || '';

	let visibleModel = false;
	let editing = false;

	let toggleEdit = () => (editing = !editing);

	$: if (form) {
		console.log('form found in layout');
		if (form.success) {
			addToast({
				message: form.message || 'success',
				type: 'success',
				life: 3000
			});
		} else {
			addToast({
				message: form.message || 'Failed.',
				type: 'error',
				life: 3000
			});
		}
	}
</script>

<ModelHelper bind:showing={visibleModel}>
	<form
		class="settingsForm"
		action="?/updateClub"
		method="post"
		use:enhance={() => {
			visibleModel = false;
		}}
	>
		<h2>Settings</h2>
		<div class="formItem">
			<Input name="clubName" label="Club Name" bind:value={data.club.name} />
		</div>
		<div class="formItem">
			<Input name="imageURL" label="Image URL" bind:value={clubImage} />
		</div>
		<div class="formItem">
			<Button value="Update" />
		</div>
	</form>
</ModelHelper>

<div class="wrap">
	<div class="content">
		<div class="editor">
			{#if data.clubPerms.admin || data.clubPerms.updateDescription}
				<div class="editTools">
					{#if !editing}
						<button class="editButton" on:click={toggleEdit}>
							<img alt="edit" src="/edit.svg" />
						</button>
					{:else}
						<form
							action="?/updateClub"
							method="post"
							use:enhance={closeModal(() => (editing = false))}
						>
							<input name="clubDescription" style="display: none;" bind:value={clubDescription} />
							<button class="editButton">
								<img alt="edit" src="/check.svg" />
							</button>
						</form>
					{/if}
				</div>
			{/if}
			<MdEditor
				editable={editing && (data.clubPerms.admin || data.clubPerms.updateDescription)}
				bind:content={clubDescription}
			/>
		</div>
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

	.settingsForm {
		background: var(--bgPure);
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		padding: 20px;
		border-radius: 5px;
	}

	.formItem {
		margin: 7px 0px;
		width: 100%;
	}

	.content {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: start;
		justify-content: center;
		min-height: 300px;
	}

	.editor {
		position: relative;
		width: 100%;
		height: 100%;
		min-height: 300px;
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
