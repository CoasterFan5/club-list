<script lang="ts">
	export let data;
</script>

{#if data.refresh}
	<meta content="0; url='{data.redirect}'" http-equiv="refresh" />
{/if}
