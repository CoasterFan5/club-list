<script lang="ts">
	import MdEditor from '$lib/components/MdEditor.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="wrap">
	{#each data.announcements as announcment}
		<div class="announcment">
			<h2>{announcment.title || 'No Announcemnts'}</h2>
			{#if announcment.createdAt}
				<p class="timestamp">
					{new Intl.DateTimeFormat('en-US', {
						dateStyle: 'long',
						timeStyle: 'short'
					}).format(announcment.createdAt)}
				</p>
			{/if}
			<MdEditor editable={false} content={announcment.description || 'No Announcemnts'} />
		</div>
	{/each}
</div>

<style>
	.wrap {
		width: 100%;
		height: 100%;
		padding: 50px 0px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: start;
	}
	.announcment {
		width: 90%;
		max-width: 500px;
		background: var(--bgPure);
		padding: 50px;
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
