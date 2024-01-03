<script lang="ts">
	import MdEditor from '$lib/components/MdEditor.svelte';
	import type { PageData } from './$types';
	import Button from '$lib/components/Button.svelte';

	export let data: PageData;
</script>

<div class="wrap">
	{#if data.clubPerms.admin || data.clubPerms.manageAnnouncements}
		<div class="buttonWrap">
			<Button href="./announcements/new" value="New Announcement" />
		</div>
	{/if}

	<div class="announcementList">
		{#each data.announcements as announcement}
			<div class="announcement">
				<h2>{announcement.title}</h2>
				{#if announcement.createdAt}
					<p class="timestamp">
						{new Intl.DateTimeFormat('en-US', {
							dateStyle: 'long',
							timeStyle: 'short'
						}).format(announcement.createdAt)}
					</p>
				{/if}
				<MdEditor content={announcement.description || 'No Announcement'} editable={false} />
			</div>
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
	.announcement {
		width: 100%;
		background: var(--bgPure);
		padding: 50px;
		box-sizing: border-box;
		border-radius: 5px;
		margin-bottom: 50px;
	}
	.timestamp {
		margin: 0px;
		color: var(--bgDark);
	}
	h2 {
		margin: 0px;
		font-size: 1.5rem;
		font-weight: 500;
	}
</style>
