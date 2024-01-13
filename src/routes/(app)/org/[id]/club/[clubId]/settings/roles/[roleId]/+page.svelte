<script lang="ts">
	import type { PageData } from './$types';
	import { createPermissionsCheck, permissionObjectDescriptions, keys } from '$lib/permissions';
	import { enhance } from '$app/forms';
	import Checkbox from "$lib/components/Checkbox.svelte"

	// https://stackoverflow.com/a/7225450/7589775
	function toTitleCase(str: string) {
		const result = str.replace(/([A-Z])/g, ' $1');
		return result.charAt(0).toUpperCase() + result.slice(1);
	}

	let submitButton: HTMLButtonElement;

	export let data: PageData;
	$: permissions = createPermissionsCheck(data.role.permissionInt);
</script>

<main>
	<form
		action="/org/{data.org.id}/club/{data.club.id}/settings/roles?/updateRole"
		method="POST"
		use:enhance
	>
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
						name={key}
						value={permissions[key]}
						on:input={() => submitButton.click()}
					/>
				</div>
			</div>
		{/each}

		<button bind:this={submitButton} hidden type="submit" />
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
		margin: 1rem;
		display: flex;
		flex-direction: row;

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
