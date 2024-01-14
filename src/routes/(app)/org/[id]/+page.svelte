<script lang="ts">
	import { enhance } from '$app/forms';
	import Fuse from 'fuse.js';
	import { pushState } from '$app/navigation';
	import { page } from '$app/stores';

	import type { ActionData, PageData } from './$types';

	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import Modal from '$lib/modules/Modal.svelte';
	import { addToast } from '$lib/components/toaster';

	let searchTerm = '';

	export let data: PageData;
	export let form: ActionData;

	let searchBox: HTMLInputElement;

	let showModal = () => {
		pushState('', {
			showingModal: 'createClub'
		});
	};

	let focusSearch = () => searchBox.focus();

	const fuse = new Fuse(data.clubs, {
		keys: ['name', 'description']
	});

	let sortedClubs: typeof data.clubs;
	$: if (searchTerm.length > 0) {
		sortedClubs = fuse.search(searchTerm).map((result) => result.item);
	} else {
		sortedClubs = data.clubs;
	}

	const startLeaveOrg = () => {
		pushState('', {
			showingModal: 'leaveOrg'
		});
	};

	let leavingOrg = false;

	$: if (form) {
		history.back();
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

{#if $page.state.showingModal == 'leaveOrg'}
	<Modal
		on:close={() => {
			history.back();
		}}
	>
		<form method="post" action="?/leaveOrg" use:enhance>
			<h2>Hold Up!</h2>
			<p>Are you sure you want to leave this organization?</p>
			<p>All your data and permissions will be lost forever</p>
			<Button value="Leave {data.org.name}" />
		</form>
	</Modal>
{/if}

{#if $page.state.showingModal == 'createClub'}
	<Modal on:close={() => history.back()}>
		<form action="?/createClub" method="post" use:enhance>
			<h2>Create Club</h2>
			<div class="formItem">
				<Input name="clubName" bg="white" label="Club Name" />
			</div>
			<div class="formItem">
				<Button type="submit" value="Create" />
			</div>
		</form>
	</Modal>
{/if}

<div class="header">
	<h1>{data.org.name}</h1>
	<a href="/org/{data.org.id}/settings">
		<img class="icon" src="/icons/settings.svg" alt="settings" />
	</a>
	<button on:click={startLeaveOrg}>
		<img class="icon" src="/icons/leave.svg" alt="leave" />
	</button>
</div>

<div class="wrap">
	<div class="content">
		{#if data.clubs.length < 1}
			<h2>
				No clubs here yet. {#if data.orgUser.role == 'ADMIN' || data.orgUser.role == 'OWNER'}<button
						class="textButton"
						on:click={showModal}>Create One?</button
					>{/if}
			</h2>
		{:else}
			<div class="clubs">
				<button class="searchWrap" on:click={focusSearch}>
					<img alt="search" src="/search.svg" />
					<input
						bind:this={searchBox}
						class="search"
						placeholder="Search..."
						tabindex="-1"
						bind:value={searchTerm}
					/>
				</button>
				{#each sortedClubs as club (club.id)}
					<a class="club" href="/org/{data.orgUser.organizationId}/club/{club.id}">
						<div class="clubInner">
							{#if club.imageURL}
								<img class="clubImage" alt="{club.name} background image" src={club.imageURL} />
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

			{#if data.orgUser.role == 'ADMIN' || data.orgUser.role == 'OWNER'}
				<p>
					Looking for more? <button class="textButton" on:click={showModal}>Create a club!</button>
				</p>
			{/if}
		{/if}
	</div>
</div>

<style lang="scss">
	.icon:hover {
		filter: var(--redIconFilter);
	}
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
	.header {
		background: var(--bgMid);
		width: 100%;
		padding: 25px 0px;
		box-sizing: border-box;
		box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.1);
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}
	.header a {
		all: unset;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		padding: 0px 5px;
	}
	.header button {
		all: unset;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		padding: 0px 5px;
	}
	.header img {
		height: 80%;
	}
	.header h1 {
		margin: 0px 25px;
		height: 100%;
	}

	.content {
		width: 100%;
		box-sizing: border-box;
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

		&::after {
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

		&:hover::after {
			transform: scaleX(1);
		}
	}

	.error {
		color: red;
	}

	.clubs {
		width: 100%;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;

		.clubInner:hover {
			box-shadow: 0px 0px 4px 4px rgba(0, 0, 0, 0.15);
			transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.5s;
		}
	}
	.club {
		aspect-ratio: 5/2;
		width: calc(100% / 3);
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

		&::after {
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

		& > h2 {
			margin: 5px;
			font-weight: 400;
		}
	}

	.formItem {
		margin: 7px;
	}

	.searchWrap {
		width: 100%;
		box-sizing: border-box;
		margin: 10px 0px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--bgPure);
		transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.2s;
		outline: 0px;
		border: 0px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 3px;
		overflow: hidden;
		border: 1px solid transparent;

		img {
			padding: 0px 10px;
		}

		&:hover,
		&:focus {
			border: 1px solid var(--accent);
			cursor: text;
		}
	}

	.search {
		width: 100%;
		outline: 0px;
		padding: 10px;
		border-radius: 5px;
		overflow: hidden;
		border: 0px;
		font-size: 1.2rem;
		height: 100%;
	}
</style>
