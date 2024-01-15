<script lang="ts">
	import Announcement from '$lib/components/Announcement.svelte';
	import Button from '$lib/components/Button.svelte';

	export let data;
</script>

<div class="wrap">
	{#if data.clubPerms.admin || data.clubPerms.manageAnnouncements}
		<div class="buttonWrap">
			<Button href="./announcements/new" value="New Announcement" />
		</div>
	{/if}

	<div class="announcementList">
		{#each data.announcements as announcement}
			<Announcement {announcement} />
		{/each}
	</div>
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
	
	.announcementList {
		width: 90%;
		max-width: 600px;
		padding-top: 25px;
	}
</style>
