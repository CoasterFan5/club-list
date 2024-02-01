<script lang="ts">
	import Calendar from '$lib/components/Calendar.svelte';
	import Link from '$lib/components/Link.svelte';

	export let data;
</script>

<Calendar bind:events={data.events} />
<div class="linkHolder">
	{#if data.filterMode == data.filterModes.CLUB}
		<Link href="/calendar?filter=org">View events in all clubs</Link>
	{:else}
		<Link href="/calendar?filter=club">View events in clubs you are in</Link>
	{/if}
</div>

<div class="spacer" />

<style lang="scss">
	.spacer {
		min-height: 25px;
		width: 100%;
	}
</style>
