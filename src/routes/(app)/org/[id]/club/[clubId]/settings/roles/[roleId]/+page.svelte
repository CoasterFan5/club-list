<script lang="ts">
  import type { PageData } from "./$types";
  import { createPermissionsCheck, permissionObjectDescriptions } from "$lib/permissions";

  export let data: PageData;
  $: permissions = createPermissionsCheck(data.role.permissionInt);
</script>

<main>
  <!-- TODO: color input, permission settings -->
	<h1>{data.role.name}</h1>

  <div class="container">
    {#each Object.entries(permissionObjectDescriptions) as [key, value]}
      <div class="role">  
        <h2>{key}</h2>
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
  }
</style>
