<script lang="ts">
	export let data;
</script>
<div class="wrap">
	<h2>Clubsaurus Blog</h2>
	<div class="articles">
		{#each data.articles as article}
			<a href="/blog/{article.articleURL}" class="article">
				<h2>{article.articleName}</h2>
				<p>This will be the article description, however, I have not yet added short article descriptions.</p>
			</a>
		{/each}
	</div>
</div>


<style lang="scss">
	.wrap {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: center;
	}

	.articles {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(30rem, 1fr));
		gap: 1rem;
		width: 90%;
		max-width: 70rem;
	}

	.article {
		text-decoration: none;
		padding: 1rem;

		h2 {
			font-size: 1.75rem;
			margin: 0;
			color: var(--dark);
		}
		p {
			margin: 0px;
			margin-top: 1rem;
			font-size: 1.2rem;
			line-height: 1.25rem;
			color: var(--mid);
		}

		&:hover {
			h2 {
				color: var(--accent);
			}

			p {
				color: var(--accent);
			}
		}
	}
</style>