<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import { handleForm } from '$lib/utils/formToaster.js';

	export let data;
	export let form;

	$: handleForm(form, 'Organization Updated!');
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
			<Button value="Update" />
		</div>
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
	}

	h2 {
		margin: 0;
		margin-bottom: 2rem;
	}

	.itemSpacer {
		width: 100%;
		padding: 7px 0px;
	}
</style>
