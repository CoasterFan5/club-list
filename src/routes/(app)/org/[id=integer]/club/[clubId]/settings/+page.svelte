<script lang="ts">
	import { enhance } from '$app/forms';
	import { pushState } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$lib/components/Button.svelte';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import Input from '$lib/components/Input.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import { handleForm } from '$lib/utils/formToaster.js';

	export let data;
	export let form;

	let name = data.club.name || '';
	let imgURL = data.club.imageURL || '';

	let confirmInput = '';

	$: handleForm(form, 'Club Updated!');
</script>

{#if $page.state.showingModal == 'deleteClub'}
	<Modal on:close={() => history.back()}>
		<h2>Delete Club?</h2>
		<p>This will remove all club members and roles</p>
		<p>Type <strong>{data.club.name}</strong> to confirm</p>

		<Input bg="var(--bgPure)" label="Club Name" bind:value={confirmInput} />
		<hr />
		<form action="?/deleteClub" method="post" use:enhance>
			<Button disabled={confirmInput != data.club.name} value="Delete Club" />
		</form>
	</Modal>
{/if}

<div class="wrap">
	<form
		class="displayWrap"
		action="?/updateClub"
		method="post"
		use:enhance={() =>
			async ({ update }) => {
				await update({ reset: false });
			}}
	>
		<div class="formItem">
			<Input name="clubName" bg="white" label="Club Name" value={name} />
		</div>
		<div class="formItem">
			<Input name="imgURL" bg="white" label="Image URL" value={imgURL} />
		</div>
		<div class="formItem">
			<Checkbox name="joinable" checked={data.club.openToJoin} label="Allow Joining" />
		</div>

		<div class="formItem">
			<Button type="submit" value="Save" />
		</div>
	</form>
	<div class="displayWrap">
		<h2>Danger Zone</h2>
		<div class="formItem">
			<Button
				value="Delete Club"
				on:click={() => {
					pushState('', {
						showingModal: 'deleteClub'
					});
				}}
			/>
		</div>
	</div>
</div>

<style lang="scss">
	.wrap {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: start;
		flex-direction: column;
	}
	.formItem {
		width: 100%;
		margin: 7px 0px;
		display: flex;
	}
	.displayWrap {
		padding: 50px;
		background: var(--bgPure);
		box-sizing: border-box;
		max-width: 500px;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: 50px;
		justify-content: center;
		border-radius: 5px;
	}
	hr {
		border: 0px;
	}
</style>
