<script lang="ts">
	import type { PageData } from './$types';
	import Button from '$lib/components/Button.svelte';

	export let data: PageData;
</script>

<div class="wrap">
    <!-- TODO: Manage events permission -->
	{#if data.clubPerms.admin}
		<div class="buttonWrap">
			<Button href="events/new" value="New Event" />
		</div>
	{/if}
</div>

<style lang="scss">
	.wrap {
		width: 100%;
		height: 100%;
		padding: 50px 0px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: start;
	}
</style>
