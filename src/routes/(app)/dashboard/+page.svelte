<script lang="ts">
	import Announcement from '$lib/components/Announcement.svelte';

	export let data;
</script>

<h1>Dashboard</h1>

{#if data.recentAnnouncements.length > 0}
	<h2>Recent Announcements</h2>

	<div class="announcements">
		{#each data.recentAnnouncements as announcement}
			<Announcement {announcement} />
		{/each}
	</div>
{/if}
