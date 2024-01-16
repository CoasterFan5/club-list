<script lang="ts">
	import Input from '$lib/components/Input.svelte';
	import Button from '$lib/components/Button.svelte';
	import { addToast } from '$lib/components/toaster';
	import { enhance } from '$app/forms';

	export let data;
	export let form;

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

<main>
	<form
		action="?/updateOrg"
		method="POST"
		use:enhance={() => {
			return async ({ update }) => {
				update({ reset: false });
			};
		}}
	>
		<h2>Display Info</h2>
		<div class="itemSpacer">
			<Input name="name" label="Name" value={data.org.name} />
		</div>
		<div class="itemSpacer">
			<Input name="slug" label="Slug" value={data.org.slug?.slug ?? ''} />
		</div>
		<div class="itemSpacer">
			<Button value="Update" />
		</div>
	</form>

	<h2 class="secondary">Dangerous Actions</h2>
	<Button type="button" value="Refresh Join Code" />
</main>

<style>
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
	}

	h2 {
		margin: 0;
		margin-bottom: 2rem;

		&.secondary {
			margin-top: 2rem;
		}
	}

	.itemSpacer {
		width: 100%;
		padding: 7px 0px;
	}
</style>
