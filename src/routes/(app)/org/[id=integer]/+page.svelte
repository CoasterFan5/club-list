<script lang="ts">
	import { enhance } from '$app/forms';
	import Fuse from 'fuse.js';
	import { pushState } from '$app/navigation';
	import { page } from '$app/stores';

	import Button from '$lib/components/Button.svelte';
	import Link from '$lib/components/Link.svelte';
	import Input from '$lib/components/Input.svelte';
	import Modal from '$lib/modules/Modal.svelte';
	import { addToast } from '$lib/components/toaster';

	let searchTerm = '';

	export let data;
	export let form;

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

	const startInvite = () => {
		pushState('', {
			showingModal: 'inviteUser'
		});
	};

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

	let confirmedOrgName = '';
</script>

{#if $page.state.showingModal == 'inviteUser'}
	<Modal
		on:close={() => {
			history.back();
		}}
	>
		<div class="joinCode">
			<p>
				Join Code (Click to copy): <button
					on:click={() => {
						navigator.clipboard.writeText(data.org.joinCode);
						addToast({
							type: 'success',
							message: 'Copied to clipboard!',
							life: 3000
						});
					}}>{data.org.joinCode}</button
				>
			</p>
		</div>
		<Button
			value="Done"
			on:click={() => {
				history.back();
			}}
		/>
	</Modal>
{/if}

{#if $page.state.showingModal == 'leaveOrg'}
	<Modal
		on:close={() => {
			history.back();
		}}
	>
		<form action="?/leaveOrg" method="post" use:enhance>
			<h2>Hold Up!</h2>
			<p>Are you sure you want to leave this organization?</p>
			<p>All your data and permissions will be lost forever</p>
			<p>Type the name of the organization, <br /><b>{data.org.name}</b>, to confirm</p>
			<div class="formItem">
				<Input bg="white" label="Organization Name" bind:value={confirmedOrgName} />
			</div>
			<div class="formItem">
				<Button disabled={confirmedOrgName != data.org.name} value="Leave {data.org.name}" />
			</div>
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

<header>
	<div class="main">
		<h1>{data.org.name}</h1>
		{#if data.orgUser?.role == "ADMIN" || data.orgUser?.role == "OWNER"}
			<a href="/org/{data.org.id}/settings">
				<img class="icon" alt="settings" src="/icons/settings.svg" />
			</a>
			<button on:click={startInvite}>
				<img class="icon" alt="invite" src="/icons/addUser.svg" />
			</button>
		{/if}
		
		
		
		
		{#if data.orgUser}
			<button on:click={startLeaveOrg}>
				<img class="icon" alt="leave" src="/icons/leave.svg" />
			</button>
		{/if}
	</div>
</header>

<div class="wrap">
	<div class="content">
		{#if data.clubs.length < 1 && data.orgUser}
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
						placeholder="Search for clubs..."
						tabindex="-1"
						bind:value={searchTerm}
					/>
				</button>
				{#if sortedClubs.length > 0}
					{#each sortedClubs as club (club.id)}
						<a class="club" href="/org/{data.org.id}/club/{club.id}">
							<div class="clubInner">
								{#if club.imageURL}
									<img class="clubImage" alt="{club.name} background image" src={club.imageURL} />
								{:else}
									<img
										class="clubImage"
										alt="{club.name} background image"
										src="/defaultClubImage.svg"
									/>
								{/if}
								<div class="clubText">
									<h2>{club.name}</h2>
								</div>
							</div>
						</a>
					{/each}
				{:else}
					<h2>No clubs found. Try searching for something else.</h2>
				{/if}
			</div>

			{#if data.orgUser && (data.orgUser.role == 'ADMIN' || data.orgUser.role == 'OWNER')}
				<p>
					Looking for more? <Link on:click={showModal}>Create a club!</Link>
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

	.joinCode {
		width: 100%;
		text-align: center;
		font-size: 1.2rem;
		color: var(--textLow);

		button {
			all: unset;
			display: inline-block;
			font-weight: 500;
			background: var(--textLow);

			&:hover {
				cursor: pointer;
				background: var(--text);
			}
		}
	}

	.textButton {
		all: unset;
		display: inline-block;
		color: var(--accent);
		font-weight: 500;

		&:hover {
			cursor: pointer;
			background: var(--text);
		}
	}
	header {
		background: var(--bgMid);
		width: 100%;
		padding: 25px 0px;
		box-sizing: border-box;
		box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.1);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		.main {
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;
			width: 100%;
		}

		a {
			all: unset;
			cursor: pointer;
			display: flex;
			align-items: center;
			justify-content: center;
			height: 100%;
			padding: 0px 5px;
		}
		button {
			all: unset;
			cursor: pointer;
			display: flex;
			align-items: center;
			justify-content: center;
			height: 100%;
			padding: 0px 5px;
		}
		img {
			height: 80%;
		}
		h1 {
			margin: 0px 25px;
			height: 100%;
		}
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
		margin-bottom: 2rem;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--bgPure);
		transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.2s;
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
		&:focus,
		&:active {
			outline: 1px solid var(--accent);
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
