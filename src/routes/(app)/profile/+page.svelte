<script lang="ts">
	import UAParser from 'ua-parser-js';

	import { enhance } from '$app/forms';
	import { pushState } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import PfpUpload from '$lib/components/PfpUpload.svelte';
	import { handleForm } from '$lib/utils/formToaster.js';

	export let data;
	export let form;

	let firstName = data.user.firstName;
	let lastName = data.user.lastName;
	let email = data.user.email;

	$: handleForm(form, 'Profile Updated!');
</script>

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
		{#if data.sessions.length > 1}
			<form action="?/invalidateAllSessions" method="POST">
				<Button value="Invalidate All Sessions" />
				<p>This will log you out of all sessions except this one.</p>
			</form>
		{/if}
		{#each data.sessions as session}
			<form class="session" action="?/invalidateSession" method="POST">
				<input name="sessionId" hidden value={session.id} />
				<p>Created at {session.createdAt.toLocaleString()}</p>
				{#if session.ip}
					<p>
						{session.ip}
						{#if data.ip === session.ip}
							(Your IP)
						{/if}
					</p>
				{:else}
					<p>Unknown IP</p>
				{/if}
				{#if session.userAgent}
					{@const ua = new UAParser(session.userAgent)}
					{@const result = ua.getResult()}
					<p>
						{result.browser.name}
						{result.browser.version}
						{#if result.os.name}
							on {result.os.name} {result.os.version}
						{/if}
					</p>
				{:else}
					<p>Unknown User Agent</p>
				{/if}

				<Button value="Invalidate" />
			</form>
		{/each}
	</Modal>
{/if}

<h1>User Settings</h1>

<main>
	<div class="section">
		<div class="sectionHeader">
			<hr class="miniHr" />
			<h3>Profile</h3>
			<hr />
		</div>
		<div class="sectionInner">
			<div class="twopane">
				<form
					class="left"
					action="?/updateProfile"
					method="post"
					use:enhance={() => {
						return ({ update }) => {
							return update({ reset: false });
						};
					}}
				>
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
				</form>
				<div class="right">
					<PfpUpload pfpUrl={data.user.pfp} />
				</div>
			</div>
		</div>
	</div>

	<div class="section">
		<div class="sectionHeader">
			<hr class="miniHr" />
			<h3>Security</h3>
			<hr />
		</div>
		<div class="sectionInner">
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
		</div>
	</div>
</main>

<style lang="scss">
	main {
		flex-direction: row;
		width: 80%;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: start;
	}

	.twopane {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;

		.left {
			display: flex;
			flex-direction: column;
			width: 50%;
		}

		.right {
			width: 50%;
			display: flex;
			flex-direction: column;
			align-items: center;
		}
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

	.section {
		width: 80%;
		display: flex;
		align-items: center;
		flex-direction: column;

		.sectionInner {
			width: 90%;
		}

		.sectionHeader {
			width: 100%;

			display: flex;
			align-items: center;
			justify-content: center;

			h3 {
				padding: 0 1rem;
				font-weight: 400;
				font-size: 1.25rem;
			}

			hr {
				flex-grow: 1;
			}

			.miniHr {
				max-width: 1rem;
			}
		}
	}
</style>
