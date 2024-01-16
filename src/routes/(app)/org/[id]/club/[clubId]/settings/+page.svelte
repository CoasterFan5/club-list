<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import Input from '$lib/components/Input.svelte';
	import { addToast } from '$lib/components/toaster';

	export let data;
	export let form;

	let name = data.club.name || '';
	let imgURL = data.club.imageURL || '';

	$: if (form) {
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
			<Input name="imgURL" bg="white" label="Image Url" value={imgURL} />
		</div>
		<div class="formItem">
			<Checkbox label="Allow Joining" />
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
