<script lang="ts">
	import { enhance } from '$app/forms';
	import { pushState } from '$app/navigation';
	import { page } from '$app/stores';
	import { closeModal } from '$lib/closeModalEnhance';
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import Link from '$lib/components/Link.svelte';
	import Modal from '$lib/components/Modal.svelte';
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

{#if $page.state.showingModal == 'createOrg'}
	<Modal on:close={() => history.back()}>
		<form action="?/create" method="post" use:enhance={closeModal(() => history.back())}>
			<h2>Create Organization</h2>
			<div class="formInput">
				<Input name="name" bg="white" label="Organization Name" />
			</div>
			<div class="formInput">
				<Button type="submit" value="Create" />
			</div>
		</form>
	</Modal>
{/if}

{#if $page.state.showingModal == 'joinOrg'}
	<Modal on:close={() => history.back()}>
		<form action="?/join" method="post" use:enhance>
			<h2>Join an Organization</h2>
			<div class="formInput">
				<Input name="joinCode" bg="white" label="Join Code" />
			</div>
			<div class="formInput">
				<Button type="submit" value="Join" />
			</div>
		</form>
	</Modal>
{/if}

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

		h1 {
			margin: 0px;
		}

		p {
			margin-top: 10px;
			font-size: 1.5rem;
		}
	}

	.formInput {
		margin: 7px;
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
