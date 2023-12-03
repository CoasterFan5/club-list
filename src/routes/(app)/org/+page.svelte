<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import ModelHelper from '$lib/modules/ModelHelper.svelte';
	import Input from '$lib/components/Input.svelte';
	import Button from '$lib/components/Button.svelte';
	import { addToast } from '$lib/components/toaster';
	import { applyAction, enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';

	let showingCreateModel = false;
	let showingJoinModel = false;

	export let data: PageData;
	export let form: ActionData;

	$: if (form) {
		addToast({
			type: form.success ? 'success' : 'error',
			life: 3000,
			message: form.message
		});
	}

	const closeModal: (lambda: () => void) => SubmitFunction = (closeModalLambda) => {
		return () => {
			return async ({ result }) => {
				await applyAction(result);
				closeModalLambda();
			};
		};
	};
</script>

<ModelHelper bind:showing={showingCreateModel}>
	<form
		use:enhance={closeModal(() => (showingCreateModel = false))}
		action="?/create"
		method="post"
	>
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
	<form use:enhance action="?/join" method="post">
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

<style lang="scss">
	.noOrgs {
		text-align: center;
		font-size: 1.2rem;

		h1 {
			margin: 0px;
		}

		p {
			margin-top: 10px;
			font-size: 1.5rem;
		}
	}

	.formInput {
		margin: 7px;
	}

	.textButton {
		all: unset;
		cursor: pointer;
		text-decoration: none;
		color: var(--accent);
		position: relative;

		&::after {
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

		&:hover::after {
			transform: scaleX(1);
		}
	}

	.orgList {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: start;

		.list {
			width: 80%;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: start;
			justify-content: center;

			a {
				font-size: 1.2rem;
				margin-bottom: 15px;
				width: 100%;
				padding: 20px;
				background: var(--dark);
				border-radius: 5px;
				color: var(--text);
			}
		}

		p {
			margin-top: 10px;
			font-size: 1.2rem;
		}
	}

	p {
		text-align: center;
	}
</style>
