<script lang="ts">
	import Input from '$lib/components/Input.svelte';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import Button from '$lib/components/Button.svelte';
	import { enhance } from '$app/forms';
	import { addToast } from '$lib/components/toaster';

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
	<h2>Visibility</h2>

	<form action="?/updateVisibility" method="post" use:enhance>
		<Input name="slug" label="Slug" />
		<p>
			Slugs are another way to access an organization. Organizations with slugs will be visible at <span
				>https://clubsaur.us/org/(slug)</span
			>
		</p>
		<Checkbox name="public" label="Public Organization" />
		<p>Public organizations can be accessed by anyone, even if they don't have a join code.</p>
		<Checkbox name="discoverable" label="Discoverable Organization" />
		<p>Discoverable organizations will show up on the organization discovery page</p>
		<br />
		<Button value="Save" />
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
		display: flex;
		flex-direction: column;
		text-align: left;
		align-items: start;
	}
	p {
		margin: 0px;
		opacity: 0.8;
		font-size: 0.8rem;
	}
</style>
