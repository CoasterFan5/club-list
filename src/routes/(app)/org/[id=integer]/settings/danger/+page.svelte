<script lang="ts">
	import { pushState } from "$app/navigation";
	import { page } from '$app/stores';

	import Modal from '$lib/modules/Modal.svelte';
	import Button from '$lib/components/Button.svelte';
</script>

{#if $page.state.showingModal === 'refreshJoinCode'}
	<Modal on:close={() => history.back()}>
		<form method="POST" action="?/refreshJoinCode">
			<h2>Are you sure?</h2>
			<p>
				Refreshing the join code
				will break every existing invite.
			</p>
			<Button value="Refresh" />
		</form>
	</Modal>
{/if}

<main>
	<h2>Danger Zone</h2>

	<form>
		<Button on:click={() => {
			pushState('', {
				showingModal: 'refreshJoinCode'
			})
		}} value="Refresh Join Code" />
	</form>
	<form>
		<Button value="Transfer Ownership" />
	</form>
	<form>
		<Button value="Delete Organization" />
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
