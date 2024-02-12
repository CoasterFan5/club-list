<script lang="ts">
	import { pushState } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import Modal from '$lib/components/Modal.svelte';

	let typedInOrgName = '';

	export let data;
</script>

{#if $page.state.showingModal === 'refreshJoinCode'}
	<Modal on:close={() => history.back()}>
		<form class="wrapForm" action="?/refreshJoinCode" method="POST">
			<h2>Are you sure?</h2>
			<p>Refreshing the join code will break every existing invite.</p>
			<Button value="Refresh" />
		</form>
	</Modal>
{/if}

{#if $page.state.showingModal === 'deleteOrg'}
	<Modal on:close={() => history.back()}>
		<div class="wrapForm">
			<h2>Are you sure?</h2>
			<p>Deleting the organization will:</p>
			<ul>
				<li>Permanently discard <b>all</b> data</li>
				{#if data.org.clubs.length > 0}
					<li>Delete <b>{data.org.clubs.length}</b> club{data.org.clubs.length > 1 ? 's' : ''}</li>
				{/if}
				{#if data.memberCount > 1}
					<li>Disassociate <b>{data.memberCount}</b> members</li>
				{/if}
				{#if data.eventCount > 0}
					<li>Unschedule all <b>{data.eventCount}</b> event{data.eventCount > 1 ? 's' : ''}</li>
				{/if}
			</ul>

			<p>Type the organization name, <b class="accent">{data.org.name}</b>, to confirm</p>

			<div class="formInput">
				<Input
					name="orgName"
					bg="white"
					label="Type Organization Name"
					bind:value={typedInOrgName}
				/>
			</div>

			<form action="?/deleteOrg" method="POST">
				<Button disabled={typedInOrgName !== data.org.name} value="Delete" />
			</form>
		</div>
	</Modal>
{/if}

<main>
	<h2>Danger Zone</h2>

	<div class="dangerAction">
		<Button
			value="Refresh Join Code"
			on:click={() => {
				pushState('', {
					showingModal: 'refreshJoinCode'
				});
			}}
		/>
	</div>
	<div class="dangerAction">
		<Button value="Transfer Ownership" />
	</div>
	<div class="dangerAction">
		<Button
			value="Delete Organization"
			on:click={() => {
				pushState('', {
					showingModal: 'deleteOrg'
				});
			}}
		/>
	</div>
</main>

<style lang="scss">
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		max-width: 500px;
		width: 100%;
	}
	.wrapForm,
	.dangerAction {
		width: 100%;
		margin: 5px 0px;
	}

	.formInput {
		margin-bottom: 1rem;
	}

	ul {
		text-align: left;
	}

	.accent {
		color: var(--accent);
	}
</style>
