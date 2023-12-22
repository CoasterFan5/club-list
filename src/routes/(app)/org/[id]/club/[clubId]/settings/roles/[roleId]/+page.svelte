<script lang="ts">
	import type { PageData } from './$types';
	import { createPermissionsCheck, permissionObjectDescriptions } from '$lib/permissions';
	import { enhance } from '$app/forms';

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
		<!-- TODO: color input, permission settings -->
		<input name="name" value={data.role.name} on:change={() => submitButton.click()} />

		<div class="container">
			{#each Object.entries(permissionObjectDescriptions) as [key, value]}
				<div class="role">
					<h2>{toTitleCase(key)}</h2>
					<p>{value}</p>
				</div>
			{/each}
		</div>

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

	input {
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
	}

	div.container {
		max-width: 800px;
	}

	div.role {
		width: 100%;
		background-color: white;
		text-align: left;
		padding: 1rem;
		margin: 1rem;
		box-sizing: border-box;

		h2 {
			margin-top: 0;
		}

		p {
			margin-bottom: 0;
		}
	}
</style>
