<script lang="ts">
	import type { LayoutData, ActionData } from './$types';
	import Button from '$lib/components/Button.svelte';
	import { enhance } from '$app/forms';
	import { addToast } from '$lib/components/toaster';
	export let data: LayoutData;
	export let form: ActionData;
	console.log(data.roles);

	let forms: Array<HTMLButtonElement | undefined> = [];

	let roles = data.roles;

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

	let colorInput: HTMLInputElement;
	let showColorPicker = () => {
		colorInput.hidden = false;
	};

	$: console.log(forms);
</script>

<div class="rolesHolder">
	{#if data.roles.length < 1}
		<h2>No roles yet</h2>
	{/if}
	{#each data.roles as role, i}
		<form
			class="role"
			style="--color: {role.color};"
			method="post"
			action="?/updateRole"
			use:enhance
		>
			<input hidden name="roleId" bind:value={role.id} />
			<div class="nameWrap">
				<input
					name="name"
					class="name"
					bind:value={role.name}
					on:blur={() => {
						forms[i]?.click();
					}}
				/>
			</div>
			<div class="actions">
				<input
					name="color"
					type="color"
					class="color"
					bind:value={role.color}
					on:blur={() => {
						forms[i]?.click();
					}}
				/>
			</div>
			<button hidden type="submit" bind:this={forms[i]} />
		</form>
	{/each}
	<form class="buttonHolder" method="post" action="?/makeRole" use:enhance>
		<Button value="Add Role" />
	</form>
</div>

<style>
	h2 {
		font-weight: 400;
	}
	.role {
		position: relative;
		width: 100%;
		border: 1px solid var(--color);
		color: var(--textColor);
		border-radius: 7px;
		padding: 20px;
		box-sizing: border-box;
		margin-bottom: 7px;
		display: flex;
		flex-direction: row;
	}
	.role::after {
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
	}
	.name:focus {
		border: 1px solid var(--color);
		outline: 0px;
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
		align-items: end;
		justify-content: center;
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
	input[type='color']::-moz-color-swatch {
		border: none;
	}

	input[type='color']::-webkit-color-swatch {
		border: none;
	}
</style>
