<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	let firstName = data.user.firstName;
	let lastName = data.user.lastName;
	let email = data.user.email;
</script>

<h1>Profile</h1>

<form
	use:enhance={() => {
		return async ({ update }) => {
			update({ reset: false });
		};
	}}
	method="post"
>
	<h2>Settings</h2>

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

	{#if form}
		{#if form.success}
			<p>Information saved!</p>
		{:else}
			<p>An error ocurred: {form.message}</p>
		{/if}
	{/if}
</form>

<form use:enhance action="/logout" method="post" class="logOut">
	<Button type="submit" value="Log Out" />
</form>

<style>
	.formInput {
		margin-bottom: 1rem;
	}

	.logOut {
		margin-top: 2rem;
	}
</style>
