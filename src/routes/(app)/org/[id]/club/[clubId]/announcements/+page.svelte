<script lang="ts">
	import MdEditor from '$lib/components/editor/MdEditor.svelte';
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
			<div class="announcement">
				<h2>{announcement.title}</h2>
				{#if announcement.createdAt}
					<p class="info">
						{new Intl.DateTimeFormat('en-US', {
							dateStyle: 'long',
							timeStyle: 'short'
						}).format(announcement.createdAt)}
						{#if announcement.author}
							<span>by {announcement.author?.firstName} {announcement.author?.lastName}</span>
						{/if}
					</p>
				{/if}
				<div class="editor">
					<MdEditor content={announcement.description || 'No Announcement'} editable={false} />
				</div>
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
	.info {
		margin: 0px;
		color: var(--textLow);
	}
	h2 {
		margin: 0px;
		font-size: 1.5rem;
		font-weight: 500;
	}
	.editor {
		margin-top: 1rem;
		border-left: 5px solid var(--textLow);
	}
</style>
