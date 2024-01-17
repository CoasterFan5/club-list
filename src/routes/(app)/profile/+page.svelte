<script lang="ts">
	import { enhance } from '$app/forms';
	import { pushState } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import PfpUpload from '$lib/components/PfpUpload.svelte';
	import { addToast } from '$lib/components/toaster';
	import Modal from '$lib/modules/Modal.svelte';

	export let data;
	export let form;

	let firstName = data.user.firstName;
	let lastName = data.user.lastName;
	let email = data.user.email;

	$: if (form) {
		if (form.success) {
			addToast({
				message: 'Data Saved!',
				type: 'success',
				life: 3000
			});
		} else {
			addToast({
				message: form.message || 'An Error Occurred',
				type: 'error',
				life: 5000
			});
		}
	}
</script>

<h1>Profile</h1>

{#if $page.state.showingModal === 'changePassword'}
	<Modal on:close={() => history.back()}>
		<form
			action="?/changePassword"
			method="post"
			use:enhance={() => {
				return async ({ update }) => {
					update({ reset: false });
				};
			}}
		>
			<h2>Change Password</h2>

			<div class="formInput">
				<Input bg="white" name="oldPassword" label="Old Password" type="password" />
			</div>

			<div class="formInput">
				<Input bg="white" name="newPassword" label="New Password" type="password" />
			</div>

			<div class="formInput">
				<Input bg="white" name="confirmPassword" label="Confirm Password" type="password" />
			</div>

			<Button type="submit" value="Change Password" />
		</form>
	</Modal>
{/if}

<main>
	<div class="left">
		<form
			action="?/updateProfile"
			method="post"
			use:enhance={() => {
				return async ({ update }) => {
					update({ reset: false });
				};
			}}
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

			<h2>Actions</h2>

			<div class="formInput">
				<form class="logOut" action="/logout" method="post" use:enhance>
					<Button type="submit" value="Log Out" />
				</form>
			</div>

			<div class="formInput">
				<Button type={"button"} on:click={() => {
					pushState('', {
						showingModal: 'changePassword'
					})
				}} value="Change Password" />
			</div>
		</form>
	</div>

	<div class="right">
		<h2>Profile Picture</h2>
		<PfpUpload pfpUrl={data.user.pfp} />
	</div>
</main>

<style lang="scss">
	main {
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
