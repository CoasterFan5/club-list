<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import PfpUpload from '$lib/components/PfpUpload.svelte';
	import { addToast } from '$lib/components/toaster';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	let firstName = data.user.firstName;
	let lastName = data.user.lastName;
	let email = data.user.email;

	$: if (form) {
		if (form.success) {
			console.log('adding Toast');
			addToast({
				message: 'Data Saved!',
				type: 'success',
				life: 3000
			});
		} else {
			addToast({
				message: form.message || 'An Error Occured',
				type: 'error',
				life: 5000
			});
		}
	}
</script>

<h1>Profile</h1>

<div class="wrap">
	<div class="left">
		<form
			use:enhance={() => {
				return async ({ update }) => {
					update({ reset: false });
				};
			}}
			method="post"
			action="?/updateProfile"
		>
			<h2>Details</h2>

			<div class="formInput">
				<Input name="firstName" label="First Name" bind:value={firstName} />
			</div>

			<div class="formInput">
				<Input name="lastName" label="Last Name" bind:value={lastName} />
			</div>

			<div class="formInput">
				<Input name="email" label="Email" bind:value={email} />
			</div>

			<Button type="submit" value="Save" />

			<form use:enhance action="/logout" method="post" class="logOut">
				<Button type="submit" value="Log Out" />
			</form>
		</form>
	</div>

	<div class="right">
		<h2>Profile Picture</h2>
		<PfpUpload pfpUrl={data.user.pfp} />
	</div>
</div>

<style>
	.wrap {
		display: flex;
		flex-direction: row;
		width: 80%;
		box-sizing: border-box;
		display: flex;
		align-items: start;
		justify-content: center;
		max-width: 500px;
	}
	.left {
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		text-align: center;
	}
	.right {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: start;
		flex-direction: column;
	}
	.formInput {
		margin-bottom: 1rem;
	}

	.logOut {
		margin-top: 2rem;
	}
</style>
