<script lang="ts">
	import type { PageData } from './$types';
	import { createPermissionsCheck, permissionObjectDescriptions } from '$lib/permissions';

  // https://stackoverflow.com/a/7225450/7589775
  function toTitleCase(str: string) {
    const result = str.replace(/([A-Z])/g, ' $1');
    return result.charAt(0).toUpperCase() + result.slice(1);
  }

	export let data: PageData;
	$: permissions = createPermissionsCheck(data.role.permissionInt);
</script>

<main>
	<!-- TODO: color input, permission settings -->
	<h1>{data.role.name}</h1>

	<div class="container">
		{#each Object.entries(permissionObjectDescriptions) as [key, value]}
			<div class="role">
				<h2>{toTitleCase(key)}</h2>
				<p>{value}</p>
			</div>
		{/each}
	</div>
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
