<script lang="ts">
	import type { LayoutData, ActionData } from './$types';
	import Button from '$lib/components/Button.svelte';
	import { enhance } from '$app/forms';
	import { addToast } from '$lib/components/toaster';
	import ModelHelper from '$lib/modules/ModelHelper.svelte';
	import Input from '$lib/components/Input.svelte';
	import { closeModal } from '$lib/closeModalEnhance';
	import { flip } from 'svelte/animate';
	export let data: LayoutData;
	export let form: ActionData;

	let forms: Array<HTMLButtonElement | undefined> = [];

	$: if (form) {
		if (form.success) {
			addToast({
				type: 'success',
				message: form.message || 'Success!',
				life: 3000
			});
		} else {
			addToast({
				type: 'error',
				message: form.message || 'Failed!',
				life: 3000
			});
		}
	}

	let showDeleteForm = false;
	let selectedRoleName = '';
	let inputtedRoleName = '';
	let selectedRoleId: number;
</script>

<ModelHelper bind:showing={showDeleteForm}>
	<form
		action="?/deleteRole"
		method="post"
		use:enhance={closeModal(() => {
			showDeleteForm = false;
			inputtedRoleName = '';
		})}
	>
		<h1>Are you sure?</h1>
		<p>Type <b>{selectedRoleName}</b> to confirm</p>
		<input name="roleId" hidden bind:value={selectedRoleId} />
		<div class="formItem">
			<Input name="roleName" label="Type Role Name" bind:value={inputtedRoleName} />
		</div>
		<div class="formItem">
			<Button disabled={selectedRoleName !== inputtedRoleName} type="submit" value="Delete Role" />
		</div>
	</form>
</ModelHelper>

<div class="rolesHolder">
	{#if data.roles.length < 1}
		<h2>No roles yet</h2>
	{/if}
	
	{#each data.roles as role, i (role.id)}
		<form
			style="--color: {role.color};"
			class="role"
			action="?/updateRole"
			method="post"
			use:enhance={() => {
				// Keep all form data
				return async ({ update }) => {
					await update({ reset: false });
				};
			}}
			animate:flip
		>
			<input name="roleId" hidden bind:value={role.id} />
			<div class="nameWrap">
				<input
					name="name"
					class="name"
					bind:value={role.name}
					on:change={() => {
						forms[i]?.click();
					}}
				/>
			</div>
			<div class="actions">
				<button
					class="button"
					type="button"
					on:click={() => {
						showDeleteForm = true;
						selectedRoleId = role.id;
						selectedRoleName = role.name;
					}}
				>
					<img alt="delete" src="/icons/trash.svg" />
				</button>
				<input
					name="color"
					class="color"
					hidden
					type="color"
					bind:value={role.color}
					on:change={() => {
						forms[i]?.click();
					}}
				/>
				<a
					class="button"
					href="/org/{data.org.id}/club/{data.club.id}/settings/roles/{role.id}"
					type="button"
				>
					<img alt="goto" src="/icons/right.svg" />
				</a>
			</div>
			<button bind:this={forms[i]} hidden type="submit" />
		</form>
	{/each}
	<form class="buttonHolder" action="?/makeRole" method="post" use:enhance>
		<Button value="Add Role" />
	</form>
</div>

<style lang="scss">
	h2 {
		font-weight: 400;
	}

	.buttonHolder {
		margin-bottom: 1rem;
	}

	.role {
		position: relative;
		width: 100%;
		border: 1px solid var(--color);
		color: var(--textColor);
		border-radius: 7px;
		padding: 20px;
		height: 70px;
		box-sizing: border-box;
		margin-bottom: 7px;
		display: flex;
		flex-direction: row;

		&::after {
			content: '';
			position: absolute;
			width: 100%;
			height: 100%;
			top: 0px;
			left: 0px;
			background: var(--color);
			opacity: 0.25;
			z-index: -1;
		}
	}

	.nameWrap {
		font-weight: 400;
		margin: 0px;
		width: 100%;
	}
	.name {
		border: 0px;
		font-size: 1.3rem;
		background: transparent;
		border: 1px solid transparent;

		&:focus {
			border: 1px solid var(--color);
			outline: 0px;
		}
	}

	.rolesHolder {
		width: 100%;
		height: 100%;
		padding: 0px 10px;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.actions {
		flex-direction: row;
		display: flex;
		align-items: center;
		justify-content: end;
		height: 100%;
	}

	.color {
		all: unset;
		border: 0px;
		outline: 0px;
		cursor: pointer;
		height: 100%;
		aspect-ratio: 1/1;
		background: var(--color);
		border-radius: 100%;
		padding: 3px;
		box-sizing: border-box;
	}

	/*Don't change this, scss breaks it */
	input[type='color']::-moz-color-swatch {
		border: none;
	}

	input[type='color']::-webkit-color-swatch {
		border: none;
	}

	.button {
		all: unset;
		height: 100%;
		padding: 0px 10px;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;

		img {
			all: unset;
			height: 100%;
			aspect-ratio: 1/1;
		}
	}

	.formItem {
		width: 100%;
		margin: 7px 0px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
