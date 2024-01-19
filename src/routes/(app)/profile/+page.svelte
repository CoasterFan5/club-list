<script lang="ts">
	import UAParser from 'ua-parser-js';

	import { enhance } from '$app/forms';
	import { pushState } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import PfpUpload from '$lib/components/PfpUpload.svelte';
	import Modal from '$lib/modules/Modal.svelte';
	import { handleForm } from '$lib/utils/formToaster.js';

	export let data;
	export let form;

	let firstName = data.user.firstName;
	let lastName = data.user.lastName;
	let email = data.user.email;

	$: handleForm(form, 'Profile Updated!');
</script>

<h1>Profile</h1>

{#if $page.state.showingModal === 'changePassword'}
	<Modal on:close={() => history.back()}>
		<form
			action="?/changePassword"
			method="post"
			use:enhance={() => {
				return ({ update }) => {
					return update({ reset: false });
				};
			}}
		>
			<h2>Change Password</h2>

			<div class="formInput">
				<Input name="oldPassword" bg="white" label="Old Password" type="password" />
			</div>

			<div class="formInput">
				<Input name="newPassword" bg="white" label="New Password" type="password" />
			</div>

			<div class="formInput">
				<Input name="confirmPassword" bg="white" label="Confirm Password" type="password" />
			</div>

			<Button type="submit" value="Change Password" />
		</form>
	</Modal>
{/if}

{#if $page.state.showingModal === 'manageSessions'}
	<Modal on:close={() => history.back()}>
		<h2>Manage Sessions</h2>
		{#each data.sessions as session}
			<div class="session">
				<p>Created at {session.createdAt.toLocaleString()}</p>
				{#if session.ip}
					<p>{session.ip}</p>
				{:else}
					<p>Unknown IP</p>
				{/if}
				{#if session.userAgent}
					{@const ua = new UAParser(session.userAgent)}
					{@const result = ua.getResult()}
					{result.browser.name}
					{result.browser.version}
					{#if result.os.name}
						on {result.os.name} {result.os.version}
					{/if}
				{:else}
					<p>Unknown User Agent</p>
				{/if}
			</div>
		{/each}
	</Modal>
{/if}

<main>
	<div class="left">
		<form
			action="?/updateProfile"
			method="post"
			use:enhance={() => {
				return ({ update }) => {
					return update({ reset: false });
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
				<Button
					type="button"
					value="Change Password"
					on:click={() => {
						pushState('', {
							showingModal: 'changePassword'
						});
					}}
				/>
			</div>

			<div class="formInput">
				<Button
					type="button"
					value="Manage Sessions"
					on:click={() => {
						pushState('', {
							showingModal: 'manageSessions'
						});
					}}
				/>
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

	.session {
		padding: 1rem;
		border-radius: 1rem;
		margin: 0.5rem;
		background-color: rgba(0, 0, 0, 0.1);
	}
</style>
