<script lang="ts">
	import { qr } from '@svelte-put/qr/img';
	import Fuse from 'fuse.js';

	import { browser } from '$app/environment';
	import { enhance } from '$app/forms';
	import { pushState } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import Link from '$lib/components/Link.svelte';
	import { addToast } from '$lib/components/toaster';
	import Modal from '$lib/modules/Modal.svelte';
	import { handleForm } from '$lib/utils/formToaster.js';

	let searchTerm = '';

	export let data;
	export let form;

	let showModal = () => {
		pushState('', {
			showingModal: 'createClub'
		});
	};

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

	$: handleForm(form, 'Success!', {
		callback: (form) => {
			if (form && browser) {
				history.back();
			}
		}
	});

	let confirmedOrgName = '';
	let inviteMethod = 'code';

	let clubContainerWidth: number;
	let clubCount;
	let clubsPerRow;
	let sudoPlaceholders = 0;
	$: if(clubContainerWidth) {
		clubCount = data.clubs.length;
		clubsPerRow = Math.floor(clubContainerWidth/280)

		console.log(clubCount % clubsPerRow)
		if(clubCount % clubsPerRow != 0 && clubCount > clubsPerRow) {
			sudoPlaceholders = clubsPerRow - (clubCount % clubsPerRow)
		} else {
			sudoPlaceholders = 0;
		}

		console.log(`Done, added ${sudoPlaceholders} placeholders`)
	}


</script>

{#if $page.state.showingModal == 'inviteUser'}
	<Modal
		on:close={() => {
			history.back();
		}}
	>
		<div class="invite">
			<h2>Invite</h2>
			<div class="inviteNav">
				<button
					class="inviteMethodButton"
					class:active={inviteMethod == 'code'}
					on:click={() => {
						inviteMethod = 'code';
					}}>Code</button
				>
				<button
					class="inviteMethodButton"
					class:active={inviteMethod == 'link'}
					on:click={() => {
						inviteMethod = 'link';
					}}>Link</button
				>
				<button
					class="inviteMethodButton"
					class:active={inviteMethod == 'qr'}
					on:click={() => {
						inviteMethod = 'qr';
					}}>QR</button
				>
			</div>
			<div class="joinContent">
				{#if inviteMethod == 'code'}
					<p>Join Code (Click to copy):</p>
					<button
						class="hiddenButton"
						on:click={() => {
							navigator.clipboard.writeText(data.org.joinCode);
							addToast({
								type: 'success',
								message: 'Copied to clipboard!',
								life: 3000
							});
						}}>{data.org.joinCode}</button
					>
				{/if}
				{#if inviteMethod == 'link'}
					<p>Join Link (Click to copy):</p>
					<button
						class="hiddenButton"
						on:click={() => {
							navigator.clipboard.writeText(
								`${window.location.origin}/invite/${data.org.joinCode}`
							);
							addToast({
								type: 'success',
								message: 'Copied to clipboard!',
								life: 3000
							});
						}}>{window.location.origin}/invite/{data.org.joinCode}</button
					>
				{/if}
				{#if inviteMethod == 'qr'}
					<p>Join QR Code:</p>
					<img
						alt="qr"
						use:qr={{
							data: `${window.location.origin}/invite/${data.org.joinCode}`,
							logo: `${window.location.origin}/logo.svg`,
							shape: 'circle'
						}}
					/>
				{/if}
			</div>
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
	<h1>{data.org.name}</h1>
	<div class="orgButtons">
		{#if data.orgUser?.role == 'ADMIN' || data.orgUser?.role == 'OWNER'}
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

<main>
	{#if data.clubs.length < 1 && data.orgUser}
		<h2>
			No clubs here yet. {#if data.orgUser.role == 'ADMIN' || data.orgUser.role == 'OWNER'}<button
					class="textButton"
					on:click={showModal}>Create One?</button
				>{/if}
		</h2>
	{:else}
		<div class="clubs" bind:clientWidth={clubContainerWidth}>
			<input
				class="search"
				placeholder="Search for clubs..."
				tabindex="-1"
				bind:value={searchTerm}
			/>
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
				{#if sudoPlaceholders > 0}
					{#each {length: sudoPlaceholders} as i}
						<a  hidden class="club" href="/" >
						</a>
					{/each}
				{/if}
				
			{:else}
				<h2>No clubs found. Try searching for something else.</h2>
			{/if}
		</div>

		{#if data.orgUser && (data.orgUser.role == 'ADMIN' || data.orgUser.role == 'OWNER')}
			<p class="createOrgLink">
				Looking for more? <Link on:click={showModal}>Create a club!</Link>
			</p>
		{/if}
	{/if}
</main>

<style lang="scss">
	.icon:hover {
		filter: var(--redIconFilter);
	}

	main {
		width: calc(90%);
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: start;
		
		
	}

	.invite {
		width: 100%;
		text-align: center;
		font-size: 1.2rem;
		color: var(--textLow);
	}

	.invite h2 {
		margin: 0px;
		color: var(--textDark);
	}

	header {
		background: var(--bgMid);
		width: 100%;
		padding: 25px 0px;
		box-sizing: border-box;
		box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.1);
		justify-content: center;
		display: flex;
		flex-direction: row;
		align-items: center;
		max-width: 100%;
		flex-wrap: wrap;
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
		}

		.orgButtons {
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;
			padding: 10px 0px;
			box-sizing: border-box;
		}
	}

	.inviteNav {
		width: 100%;
		background: var(--bg);
		border-radius: 50px;
		display: flex;
		overflow: hidden;
		flex-direction: row;
		margin: 10px 0px;

		button {
			all: unset;
			cursor: pointer;
			color: var(--textDark);
			padding: 10px 30px;
			box-sizing: border-box;
			width: calc(100% / 3);
			flex-grow: 1;
			text-align: center;
			margin: 0px;
			font-size: 1.2rem;
			transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.25s;

			&.active {
				background: var(--accent50);
				opacity: 0.5;
			}

			&:hover {
				background: var(--accent50);
			}
		}
	}

	.joinContent {
		margin: 10px 0px;

		p {
			margin: 5px 0px;
			
		}
	}

	.hiddenButton {
		all: unset;
		display: inline-block;
		font-weight: 500;
		padding: 5px 10px;
		border-radius: 3px;
		font-size: 1.2rem;
		background: var(--textLow);
		transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.5s;

		&:hover {
			cursor: pointer;
			background: var(--text);
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

	.clubs {
		width: 100%;
		flex-grow: 1;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;

		.clubInner {
			position: relative;
			display: flex;
			background: var(--bgPure);
			width: 100%;
			height: 100%;
			z-index: 0;
			transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.5s;
			border-radius: 3px;

			&:hover {
				box-shadow: 0px 0px 4px 4px rgba(0, 0, 0, 0.15);
				transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.5s;
			}
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
		min-width: 280px;
		flex: 1 1 0;
		width: 0px;
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
			font-weight: normal;
		}
	}

	.formItem {
		margin: 7px;
	}

	input {
		width: 100%;
		flex-grow: 1;
		box-sizing: border-box;
		margin: 10px 0px;
		margin-bottom: 2rem;
		background: var(--bgPure);
		transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.2s;
		border: 0px;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		outline: 0px;
		padding: 10px 10px 10px 40px;
		border-radius: 5px;
		font-size: 1.2rem;
		background-image: url('/search.svg');
		background-position: 10px 10px;
		background-repeat: no-repeat;

		&:hover,
		&:focus,
		&:active {
			outline: 1px solid var(--accent);
			cursor: text;
		}
	}

	.createOrgLink {
		text-align: center;
	}
</style>
