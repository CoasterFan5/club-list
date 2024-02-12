<script lang="ts">
	import { pushState } from '$app/navigation';
	import Link from '$lib/components/Link.svelte';
	import CreateOrgModal from '$lib/modals/CreateOrgModal.svelte';
	import JoinOrgModal from '$lib/modals/JoinOrgModal.svelte';
	import { handleForm } from '$lib/utils/formToaster';

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
	export let form;

	$: handleForm(form);
</script>

<CreateOrgModal />
<JoinOrgModal />

<main>
	{#if data.user.orgUsers.length < 1}
		<div class="noOrgs">
			<h1>No Joined Organizations</h1>
			<p>
				<Link on:click={showJoinModal}>Join</Link>
				or
				<Link on:click={showCreateModal}>Create</Link> one!
			</p>
		</div>
	{/if}

	{#if data.user.orgUsers.length > 0}
		<h1>Joined Organizations</h1>
		<div class="orgList">
			<div class="list">
				{#each data.user.orgUsers as orgUser}
					<a href="/org/{orgUser.organization.id}">{orgUser.organization.name}</a>
				{/each}
			</div>

			<p>
				Not what you want? <Link on:click={showJoinModal}>Join</Link>
				or
				<Link on:click={showCreateModal}>Create</Link> a new organization.
			</p>
		</div>
	{/if}
</main>

<style lang="scss">
	main {
		width: 90%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: start;
	}

	p {
		text-align: center;
	}

	.noOrgs {
		text-align: center;
		font-size: 1.2rem;

		p {
			margin-top: 10px;
			font-size: 1.5rem;
		}
	}

	.orgList {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: start;

		.list {
			width: 90%;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: start;
			justify-content: center;

			a {
				font-size: 1.2rem;
				margin-bottom: 15px;
				width: 100%;
				padding: 20px;
				background: var(--dark);
				border-radius: 5px;
				color: var(--text);
			}
		}

		p {
			margin-top: 10px;
			font-size: 1.2rem;
		}
	}
</style>
