<script lang="ts">
  import type { PageData } from "./$types";

  export let data: PageData;
</script>

<main>
  <!-- TODO: color input, permission settings -->
	<h1>{data.role.name}</h1>
</main>

<style lang="scss">
	main {
		display: flex;
		padding: 1rem;
		align-items: center;
		justify-content: center;
	}
</style>
