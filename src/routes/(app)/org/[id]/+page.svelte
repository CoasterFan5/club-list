<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import ModelHelper from '$lib/modules/ModelHelper.svelte';
	import type { ActionData, PageData } from './$types';
	import { dynamicTitle } from '$lib/modules/DashboardNavbar.svelte';
	import Fuse from 'fuse.js'
	$dynamicTitle.name = 'Org List';
	$dynamicTitle.href = '/dashboard';

	let searchTerm = '';


	export let data: PageData;
	export let form: ActionData;

	let showingModel = false;
	let toggleModel = () => {
		showingModel = !showingModel;
	};

	let focusSearch = () => {};

	const fuse = new Fuse(data.clubs, {
		keys: ['name', 'description'],
	});

	let sortedClubs: typeof data.clubs;
	$: if (searchTerm.length > 0) {
		sortedClubs = fuse.search(searchTerm).map((result) => result.item);
	} else {
		sortedClubs = data.clubs;
	};
</script>

<ModelHelper bind:showing={showingModel}>
	<form action="?/createClub" method="post">
		<h2>Create Club</h2>
		<div class="formItem">
			<Input name="clubName" label="Club Name" />
		</div>
		<div class="formItem">
			<Button type="submit" value="Create" />
		</div>
	</form>
</ModelHelper>

<div class="wrap">
	<div class="content">
		{#if form?.success == false}
			<p class="error">Error: {form?.message}</p>
		{/if}
		{#if data.clubs.length < 1}
			<h2>
				No clubs here yet. {#if data.orgUser.role == 'ADMIN' || data.orgUser.role == 'OWNER'}<button
						class="textButton"
						on:click={toggleModel}>Create One?</button
					>{/if}
			</h2>
		{/if}
		<div class="searchWrap">
			<button class="search" on:click={focusSearch}>
				<input placeholder="Search..." bind:value={searchTerm} />
			</button>
		</div>

		<div class="clubs">
			{#each sortedClubs as club}
				<a href="/org/{data.orgUser.organizationId}/club/{club.id}" class="club">
					<div class="clubInner">
						{#if club.imageURL}
							<img class="clubImage" src={club.imageURL} alt="{club.name} background image" />
						{:else}
							<div class="clubImage" />
						{/if}
						<div class="clubText">
							<h2>{club.name}</h2>
						</div>
					</div>
				</a>
			{/each}
		</div>

		{#if data.clubs.length > 0 && (data.orgUser.role == 'ADMIN' || data.orgUser.role == 'OWNER')}
			<p>
				Looking for more? <button class="textButton" on:click={toggleModel}>Create a club!</button>
			</p>
		{/if}
	</div>
</div>

<style>
	.wrap {
		height: 100%;
		width: 100%;
		box-sizing: border-box;
		padding: 1rem 5rem;
		display: flex;
		flex-direction: row;
		align-items: start;
		justify-content: center;
	}
	.content {
		width: 100%;
		box-sizing: border-box;
		padding-right: 1rem;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: start;
	}
	.textButton {
		all: unset;
		cursor: pointer;
		text-decoration: none;
		color: var(--accent);
		position: relative;
	}
	.textButton::after {
		content: '';
		position: absolute;
		bottom: 0px;
		left: 0;
		width: 100%;
		height: 2px;
		background: var(--accent);
		transform: scaleX(0);
		transform-origin: center;
		transition: transform 0.3s ease-in-out;
	}
	.textButton:hover::after {
		transform: scaleX(1);
	}
	form {
		border-radius: 5px;
		padding: 20px;
		background: var(--bgPure);
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.clubs {
		width: 100%;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
	}
	.club {
		aspect-ratio: 5/2;
		width: 33%;
		padding: 0px 10px 20px 10px;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 320px;
		transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.5s;
	}
	.clubImage {
		position: absolute;
		width: 100%;
		height: 100%;
		z-index: -1;
		overflow: hidden;
		object-fit: cover;
		border-radius: 3px;
	}
	.club:hover .clubInner {
		box-shadow: 0px 0px 4px 4px rgba(0, 0, 0, 0.15);
		transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.5s;
	}
	.clubInner {
		position: relative;
		display: flex;
		background: var(--bgPure);
		width: 100%;
		height: 100%;
		z-index: 0;
		transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.5s;
		border-radius: 3px;
	}
	.clubText {
		position: absolute;
		bottom: 0px;
		left: 0px;
		width: 100%;
		color: var(--textLight);
		border-radius: 0px 0px 3px 3px;
	}
	.clubText::after {
		content: '';
		position: absolute;
		background: var(--mid);
		bottom: 0px;
		border-radius: 0px 0px 3px 3px;
		opacity: 0.8;
		z-index: -1;
		width: 100%;
		height: 100%;
	}
	.clubText > h2 {
		margin: 5px;
		font-weight: 400;
	}

	.formItem {
		width: 100%;
		margin: 7px;
	}

	.searchWrap {
		width: 100%;
		padding: 0px 10px 20px 10px;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.search {
		box-sizing: border-box;
		width: 100%;
		padding: 0px;
		border: 0px;
		outline: 0px;
		border: 1px solid transparent;
		border-radius: 5px;
		overflow: hidden;
		transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.2s;
	}

	.search input {
		width: 100%;
		padding: 10px 10px;
		outline: 0px;
		border: 0px;
		box-sizing: border-box;
		font-size: 1.2rem;
	}
	.search:hover {
		box-shadow: 0px 0px 1px 1px var(--accent);
	}
</style>
