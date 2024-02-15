<script lang="ts">
	import { enhance } from '$app/forms';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import {
		createPermissionNumber,
		createPermissionsCheck,
		keys,
		permissionObjectDescriptions
	} from '$lib/permissions';
	import { toTitleCase } from '$lib/titleCase.js';
	import { handleForm } from '$lib/utils/formToaster';

	

	let submitButton: HTMLButtonElement;
	let permissionIntBox: HTMLInputElement;

	export let data;
	export let form;

	$: permissions = createPermissionsCheck(data.role.permissionInt);

	let permissionInt: number;

	const updatePermissionInt = (key: (typeof keys)[number]) => {
		permissions[key] = !permissions[key];
		permissionInt = createPermissionNumber(permissions);
		permissionIntBox.value = permissionInt.toString();
		submitButton.click();
	};

	$: handleForm(form, 'Role Updated!');
</script>

<main>
	<form
		action="?/updateFullRole"
		method="POST"
		use:enhance={() => {
			return ({ update }) => {
				return update({ reset: false });
			};
		}}
	>
		<input bind:this={permissionIntBox} name="permissionInt" hidden />
		<button bind:this={submitButton} hidden type="submit" />

		<div class="title">
			<input name="name" value={data.role.name} on:change={() => submitButton.click()} />
			<input name="color" class="color" type="color" on:change={() => submitButton.click()} />
		</div>
		{#each keys as key}
			<div class="role">
				<div class="description">
					<h2>{toTitleCase(key)}</h2>
					<p>{permissionObjectDescriptions[key]}</p>
				</div>
				<div class="input">
					<Checkbox
						name={null}
						checked={permissions[key]}
						on:click={() => {
							updatePermissionInt(key);
						}}
					/>
				</div>
			</div>
		{/each}
	</form>
</main>

<style lang="scss">
	main {
		display: flex;
		padding: 1rem;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		width: 100%;
		box-sizing: border-box;
	}

	.title {
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-around;
	}

	input[name='name'] {
		background-color: transparent;
		border: 0px;
		font-size: 2rem;
		font-family: inherit;
		font-weight: 600;
		text-align: center;
		padding: 0;
	}

	.color {
		all: unset;
		border: 0px;
		outline: 0px;
		cursor: pointer;
		aspect-ratio: 1/1;
		background: var(--color);
		border-radius: 100%;
		padding: 3px;
		box-sizing: border-box;
		height: 2rem;
	}

	input[type='color']::-moz-color-swatch {
		border: none;
		border-radius: 100%;
	}

	form {
		text-align: center;
		max-width: 800px;
	}

	div.role {
		width: 100%;
		background-color: #fff;
		text-align: left;
		padding: 1rem;
		margin: 1rem 0rem;
		display: flex;
		flex-direction: row;
		box-sizing: border-box;

		h2 {
			margin-top: 0;
		}

		p {
			margin-bottom: 0;
		}

		.input {
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 1rem;
		}

		.description {
			width: 100%;
		}
	}
</style>
