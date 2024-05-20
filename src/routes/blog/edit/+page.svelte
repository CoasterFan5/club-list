<script lang="ts">
	export let data;
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
</script>

<div class="wrap">
	<div class="articles">
		{#each data.articles as article}
			<a class="article" href="/blog/edit/{article.articleURL}">
				{article.articleName}
				<div class="icons"/>
			</a>
		{/each}
		<form action="?/createArticle" method="post" use:enhance>
			<Button value="Create Article" />
		</form>
	</div>
</div>

<style lang="scss">
	.wrap {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem 0;
		box-sizing: border-box;
	}
	.articles {
		width: 90%;
		display: flex;
		flex-direction: column;
	}

	.article {
		font-size: 1.2rem;
		background: var(--bgMid);
		color: var(--textDark);
		text-decoration: none;
		box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.05);
		width: 100%;
		box-sizing: border-box;
		padding: 1rem;
		border-radius: 0.25rem;
		margin-bottom: 1rem;
	}
</style>
