<script lang="ts">
	import {
		createPermissionsCheck,
		permissionObjectDescriptions,
		keys,
		createPermissionNumber
	} from '$lib/permissions';
	import { enhance } from '$app/forms';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import { addToast } from '$lib/components/toaster';

	// https://stackoverflow.com/a/7225450/7589775
	function toTitleCase(str: string) {
		const result = str.replace(/([A-Z])/g, ' $1');
		return result.charAt(0).toUpperCase() + result.slice(1);
	}

	let submitButton: HTMLButtonElement;
	let permissionIntBox: HTMLInputElement;

	export let data;
	export let form;

	$: permissions = createPermissionsCheck(data.role.permissionInt);

	let permissionInt: number;

	const updatePermissionInt = async (key: string) => {
		(permissions as { [key: string]: boolean })[key] = !(permissions as { [key: string]: boolean })[
			key
		];
		permissionInt = createPermissionNumber(permissions);
		permissionIntBox.value = permissionInt.toString();
		submitButton.click();
	};

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
</script>

<main>
	<form
		action="?/updateFullRole"
		method="POST"
		use:enhance={() => {
			return async ({ update }) => {
				update({ reset: false });
			};
		}}
	>
		<input bind:this={permissionIntBox} name="permissionInt" hidden />
		<button bind:this={submitButton} hidden type="submit" />
		<!-- TODO: color input -->

		<input name="name" value={data.role.name} on:change={() => submitButton.click()} />
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

	input[name='name'] {
		background-color: transparent;
		border: 0px;
		font-size: 2rem;
		font-family: inherit;
		font-weight: 600;
		text-align: center;
		width: 100%;
		padding: 0;
	}

	form {
		text-align: center;
		max-width: 800px;
	}

	div.role {
		width: 100%;
		background-color: white;
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
