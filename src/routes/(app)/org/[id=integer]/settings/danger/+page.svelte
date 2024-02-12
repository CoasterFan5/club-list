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
		<form action="?/refreshJoinCode" method="POST">
			<h2>Are you sure?</h2>
			<p>Refreshing the join code will break every existing invite.</p>
			<Button value="Refresh" />
		</form>
	</Modal>
{/if}

{#if $page.state.showingModal === 'deleteOrg'}
	<Modal on:close={() => history.back()}>
		<form action="?/deleteOrg" method="POST">
			<h2>Are you sure?</h2>
			<p>Deleting the organization will:</p>
			<ul>
				<li>Permanently delete <b>all</b> data</li>
				<li>Remove all <b>{data.org.clubs.length}</b> clubs</li>
				<li>Disassociate all <b>{data.memberCount}</b> members</li>
				<li>Unschedule all <b>{data.eventCount}</b> events</li>
			</ul>

			<p>Type the organization name to confirm</p>

			<Input
				name="orgName"
				label="Type Organization Name"
				bind:value={typedInOrgName}
			/>

			<Button value="Delete" disabled={typedInOrgName !== data.org.name} />
		</form>
	</Modal>
{/if}

<main>
	<h2>Danger Zone</h2>

	<form>
		<Button
			value="Refresh Join Code"
			on:click={() => {
				pushState('', {
					showingModal: 'refreshJoinCode'
				});
			}}
		/>
	</form>
	<form>
		<Button value="Transfer Ownership" />
	</form>
	<form>
		<Button
			value="Delete Organization"
			on:click={() => {
				pushState('', {
					showingModal: 'deleteOrg'
				});
			}}
		/>
	</form>
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
	form {
		width: 100%;
		margin: 5px 0px;
	}
</style>
