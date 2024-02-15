<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import Input from '$lib/components/Input.svelte';
	import { handleForm } from '$lib/utils/formToaster.js';

	export let data;
	export let form;

	let name = data.club.name || '';
	let imgURL = data.club.imageURL || '';

	$: handleForm(form, 'Club Updated!');
</script>

<div class="wrap">
	<form
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
</div>

<style lang="scss">
	.wrap {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: start;
		justify-content: center;
	}
	.formItem {
		width: 100%;
		margin: 7px 0px;
		display: flex;
	}
	form {
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
</style>
