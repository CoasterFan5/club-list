<script lang="ts">
	import Input from '$lib/components/Input.svelte';
	import Button from '$lib/components/Button.svelte';
	import type { PageData, ActionData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	import { enhance } from '$app/forms';
	import { addToast } from '$lib/components/toaster';

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

<form
	class="wrap"
	method="POST"
	action="?/updateOrg"
	use:enhance={() => {
		return async ({ update }) => {
			update({ reset: false });
		};
	}}
>
	<h2>General Settings</h2>
	<hr />
	<div class="itemSpacer">
		<Input name="name" label="Name" bind:value={data.org.name} />
	</div>
	<div class="itemSpacer">
		<Button value="Update" />
	</div>
</form>

<style>
	.wrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;
		max-width: 500px;
	}
	h2 {
		margin: 0px;
	}
	.itemSpacer {
		width: 100%;
		padding: 7px 0px;
	}
</style>
