<script lang="ts">
	import type {ActionData, PageData } from './$types';
	export let data: PageData;
	export let form: ActionData;
	import ModelHelper from '$lib/modules/ModelHelper.svelte';
	import Input from '$lib/components/Input.svelte';
	import Button from '$lib/components/Button.svelte';
	import { addToast } from '$lib/components/toaster';

	let showingCreateModel = false;
	let showingJoinModel = false;

	if(form) {
		if(form.success) {
			addToast({
				type: "success",
				life: 3000,
				message: `${form.message}`
			})
		} else {
			addToast({
				type: "error",
				life: 3000,
				message: `${form.message}`
			})
		}
	}
</script>

<ModelHelper bind:showing={showingCreateModel}>
	<form action="?/create" method="post">
		<h2>Organization Name</h2>
		<div class="formInput">
			<Input label="Organization Name" name="name" />
		</div>
		<div class="formInput">
			<Button type="submit" value="Create" />
		</div>
	</form>
</ModelHelper>

<ModelHelper bind:showing={showingJoinModel}>
	<form action="?/join" method="post">
		<h2>Join an Organization</h2>
		<div class="formInput">
			<Input label="Join Code" name="joinCode" />
		</div>
		<div class="formInput">
			<Button type="submit" value="Join" />
		</div>
	</form>
</ModelHelper>

{#if data.user.orgUsers.length < 1}
	<div class="noOrgs">
		<h1>No Joined Organizations</h1>
		<p>
			<button
				class="textButton"
				on:click={() => {
					showingJoinModel = true;
				}}>Join</button
			>
			or
			<button
				on:click={() => {
					showingCreateModel = true;
				}}
				class="textButton">Create</button
			> one!
		</p>
	</div>
{/if}

{#if data.user.orgUsers.length > 0}
	<h1>Joined Organizations</h1>
	<div class="orgList">
		<div class="list">
			{#each data.user.orgUsers as orgUser}
				<a href="/org/{orgUser.organization.id}">{orgUser.organization.name}</a>
			{/each}
		</div>

		<p>
			Not what you want? <button
				class="textButton"
				on:click={() => {
					showingJoinModel = true;
				}}>Join</button
			>
			or
			<button
				on:click={() => {
					showingCreateModel = true;
				}}
				class="textButton">Create</button
			> a new organization
		</p>
	</div>
{/if}

<style>
	.noOrgs {
		text-align: center;
		font-size: 1.2rem;
	}
	.noOrgs h1 {
		margin: 0px;
	}

	.formInput {
		margin: 7px;
	}

	.noOrgs p {
		margin-top: 10px;
		font-size: 1.5rem;
	}
	.textButton {
		all: unset;
		cursor: pointer;
		text-decoration: none;
		color: var(--accent);
		position: relative;
	}
	.textButton::after {
		content: '';
		position: absolute;
		bottom: 0px;
		left: 0;
		width: 100%;
		height: 2px;
		background: var(--accent);
		transform: scaleX(0);
		transform-origin: center;
		transition: transform 0.3s ease-in-out;
	}
	.textButton:hover::after {
		transform: scaleX(1);
	}
	.orgList {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: start;
	}
	.orgList .list {
		width: 80%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: start;
		justify-content: center;
	}
	.orgList .list a {
		font-size: 1.2rem;
		margin-bottom: 15px;
		width: 100%;
		padding: 20px;
		background: var(--dark);
		border-radius: 5px;
		color: var(--text);
	}
	.orgList .list a:hover {
		background: var(--mid);
	}
	.orgList p {
		margin-top: 10px;
		font-size: 1.2rem;
	}

	p {
		text-align: center;
	}
</style>
