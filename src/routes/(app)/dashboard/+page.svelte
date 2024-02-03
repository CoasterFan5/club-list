<script lang="ts">
	import Fuse from 'fuse.js';

	import Announcement from '$lib/components/Announcement.svelte';
	import ClubList from '$lib/components/ClubList.svelte';
	import Link from '$lib/components/Link.svelte';
	import { pushState } from '$app/navigation';
	import CreateOrgModal from '$lib/modals/CreateOrgModal.svelte';
	import JoinOrgModal from '$lib/modals/JoinOrgModal.svelte';
	import { handleForm } from '$lib/utils/formToaster.js';

	function showCreateModal() {
		pushState('', {
			showingModal: 'createOrg'
		});
	}

	function showJoinModal() {
		pushState('', {
			showingModal: 'joinOrg'
		});
	}

	export let data;

	const fuse = new Fuse(data.allClubs, {
		keys: ['name', 'description']
	});

	let searchTerm = '';

	let sortedClubs: typeof data.allClubs;
	$: if (searchTerm.length > 0) {
		sortedClubs = fuse.search(searchTerm).map((result) => result.item);
	} else {
		sortedClubs = data.allClubs;
	}

	export let form;

	$: handleForm(form);
</script>

<CreateOrgModal />
<JoinOrgModal />

<div class="wrap">
	<main class="content">
		<h1>Welcome back, {data.user?.firstName}!</h1>

		<div class="sections">
			<div class="left">
				{#if false}
					<div class="clubs">
						<div class="topBar">
							<h2>Clubs</h2>
							<input
								class="search"
								placeholder="Search for clubs..."
								tabindex="-1"
								bind:value={searchTerm}
							/>
							<ClubList clubs={sortedClubs} />
						</div>
					</div>
				{:else}
					<p>
						You are not in any clubs.{' '}
						<Link on:click={showJoinModal}>Join</Link>
						or
						<Link on:click={showCreateModal}>Create</Link> one now!
					</p>
				{/if}
			</div>

			{#if data.recentAnnouncements.length > 0}
				<div class="right noMobile">
					<div class="recentAnnounce">
						<h2>Recent Announcements</h2>
						{#each data.recentAnnouncements as announcement}
							<Announcement {announcement} />
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</main>
</div>

<style lang="scss">
	.wrap {
		width: 100%;
		box-sizing: border-box;
		padding: 20px 0px;
		display: flex;
		align-items: start;
		justify-content: center;
		height: 100%;
	}
	.content {
		width: 90%;
		display: flex;
		flex-direction: column;
	}
	.sections {
		display: flex;
		flex-direction: row;
	}
	.left {
		text-align: center;
		width: 100%;
	}

	.right {
		width: 600px;
		padding-left: 50px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: start;
	}
	h1 {
		text-align: center;
	}
	h2 {
		text-align: center;
	}

	.search {
		width: 100%;
		flex-grow: 1;
		box-sizing: border-box;
		margin: 2rem 0px;
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

	.recentAnnounce {
		padding: 10px;
		background: var(--bgPure);
		border-radius: 5px;

		h2 {
			margin: 0px;
			padding-top: 10px;
			text-decoration: underline;
		}
	}

	@media screen and (max-width: 500px) {
		.noMobile {
			display: none;
		}
	}
</style>
