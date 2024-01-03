<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import { addToast } from '$lib/components/toaster';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;

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
			<Input bg="white" name="clubName" label="Club Name" value={name} />
		</div>
		<div class="formItem">
			<Input bg="white" name="imgURL" label="Image Url" value={imgURL} />
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
