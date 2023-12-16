<script lang="ts">
	import type { PageData } from './$types';
	import MdEditor from '$lib/components/MdEditor.svelte';
	import { enhance } from '$app/forms';
	import { closeModal } from '$lib/closeModalEnhance';
	export let data: PageData;

	let clubDescription = data.club.description || '<h1>No description yet :(</h1>';
	let editing = false;

	let toggleEdit = () => (editing = !editing);
</script>

<div class="wrap">
	<h2>About</h2>
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
