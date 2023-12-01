<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import ModelHelper from '$lib/modules/ModelHelper.svelte';
	import type { PageData } from './$types';
	import MdEditor from '$lib/components/MdEditor.svelte';
	import { enhance } from '$app/forms';
	export let data: PageData;

	let clubDescription = data.club.description || '<h1>No description yet :(</h1>';
	let clubImage = data.club.imageURL || '';

	let visibleModel = false;
	let editing = false;

	let toggleEdit = () => (editing = !editing);
	let showModel = () => (visibleModel = true);
</script>

<ModelHelper bind:showing={visibleModel}>
	<form
		class="settingsForm"
		method="post"
		use:enhance={() => {
			visibleModel = false;
		}}
		action="?/updateClub"
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
	<div class="header">
		{#if clubImage}
			<img class="headerImage" src={clubImage} alt={data.club.name + ' image'} />
		{/if}
		<h1 class="title">{data.club.name}</h1>
		{#if data.clubPerms.admin || data.clubPerms.updateAppearance}
			<div class="toolbar">
				<button on:click={showModel}>
					<img src="/settings.svg" alt="settings" />
				</button>
			</div>
		{/if}
	</div>
	<div class="content">
		<div class="editor">
			{#if data.clubPerms.admin || data.clubPerms.updateDescription}
				<div class="editTools">
					{#if !editing}
						<button class="editButton" on:click={toggleEdit}>
							<img src="/edit.svg" alt="edit" />
						</button>
					{:else}
						<form
							use:enhance={() => {
								return () => {
									editing = false;
								};
							}}
							method="post"
							action="?/updateClub"
						>
							<input name="clubDescription" bind:value={clubDescription} style="display: none;" />
							<button class="editButton">
								<img src="/check.svg" alt="edit" />
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
		<div class="announcements">
			<h2>Latest from {data.club.name}</h2>
			<div class="announcementWrap">
				{#if data.club.announcements.length > 0}
					<div class="aWrap">
						<div class="announcement">
							<h3>{data.club.announcements[0].title}</h3>
							<MdEditor editable={false} content={data.club.announcements[0].description} />
						</div>
					</div>
				{/if}
				{#if data.club.announcements.length > 1}
					<div class="aWrap">
						<div class="announcement">
							<h3>{data.club.announcements[1].title}</h3>
							<MdEditor editable={false} content={data.club.announcements[1].description} />
						</div>
					</div>
				{/if}
			</div>
			<div class="buttonWrap">
				<a href="./{data.club.id}/announcements" class="button">See All</a>
			</div>
		</div>
	</div>
</div>

<style>
	.wrap {
		height: 100%;
		width: 90%;
		box-sizing: border-box;
		padding-top: 1rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: start;
	}
	.header {
		position: relative;
		width: 100%;
		aspect-ratio: 3/1;
		border-radius: 15px;
		overflow: hidden;
	}
	.headerImage {
		position: absolute;
		max-width: 100%;
		width: 100%;
		height: 100%;
		z-index: -1;

		object-fit: cover;
	}

	.title {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 3rem;
		margin: 0px;
		background: rgba(255, 255, 255, 0.75);
		font-weight: 400;
		text-align: center;
	}
	.toolbar {
		position: absolute;
		bottom: 0px;
		right: 0px;
		padding: 7px;
	}
	.toolbar button {
		all: unset;
		transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.5s;
		border-radius: 100%;
		cursor: pointer;
	}
	.toolbar img {
		max-width: 36px;
	}
	.toolbar button:hover {
		rotate: 30deg;
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
	}
	.editTools img {
		aspect-ratio: 1/1;
	}
	.editButton {
		all: unset;
		display: flex;
		width: 32px;
		height: 32px;
		cursor: pointer;
	}
	.announcements {
		width: 100%;
		height: 100%;
		margin-bottom: 2rem;
	}
	.announcementWrap {
		width: 100%;
		display: flex;
		align-items: stretch;
		justify-content: center;
		flex-grow: 1;
		flex-wrap: wrap;
		height: 100%;
		box-sizing: border-box;
	}
	.announcement {
		display: flex;
		width: 100%;
		border-radius: 10px;
		flex-direction: column;
		box-sizing: border-box;
		padding: 25px;
		background: var(--bgPure);
		height: 100%;
		flex-grow: 1;
	}
	.aWrap {
		flex: 1 1 0;
		height: 100%;
		padding: 10px;
		width: 50%;
		box-sizing: border-box;
		min-width: 300px;
	}
	.buttonWrap {
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 10px 0px;
	}
	.button {
		border-radius: 5px;
		padding: 10px 20px;
		font-size: 1.3rem;
		color: var(--accent);
		text-decoration: none;
		border: 1px solid var(--accent);
		transition: background cubic-bezier(0.075, 0.82, 0.165, 1) 0.5s;
	}
	.button:hover,
	.button:focus {
		background: var(--accent);
		color: var(--bgPure);
	}
</style>
