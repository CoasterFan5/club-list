<script lang="ts">
	import MdEditor from '$lib/components/editor/MdEditor.svelte';

	interface Announcement {
		title: string;
		description: string | null;
		createdAt: Date | null;
		author: {
			firstName: string;
			lastName: string;
		} | null;
	}

	export let announcement: Announcement;
</script>

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
		<MdEditor
			content={announcement.description || 'No Announcement'}
			editable={false}
			saveable={false}
		/>
	</div>
</div>

<style lang="scss">
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
