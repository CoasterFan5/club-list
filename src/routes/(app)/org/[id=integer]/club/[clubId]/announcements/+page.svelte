<script lang="ts">
	import Announcement from '$lib/components/Announcement.svelte';
	import Button from '$lib/components/Button.svelte';

	export let data;
</script>

<main>
	{#if data.clubPerms.admin || data.clubPerms.manageAnnouncements}
		<div>
			<Button href="./announcements/new" value="New Announcement" />
		</div>
	{/if}

	<div class="list">
		{#each data.announcements as announcement}
			<Announcement {announcement} />
		{/each}
	</div>
</main>

<style lang="scss">
	main {
		width: 100%;
		height: 100%;
		padding: 50px 0px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: start;
	}

	.list {
		width: 90%;
		max-width: 600px;
		padding-top: 25px;
	}
</style>
