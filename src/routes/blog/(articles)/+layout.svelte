<script lang="ts">
	import Footer from '$lib/components/home/Footer.svelte';
	import Navbar from '$lib/components/home/Navbar.svelte';

	export let data;
</script>

<Navbar />
<div class="wrap">
	<slot />
</div>
<div class="alsoLike">
	<div class="alsoLikeInner">
		<h3>You may also like:</h3>
		<div class="articles">
			{#each data.threeRandomArticles as article}
				<a class="articleWrap" href={'/blog/' + article.articleURL}>
					<div class="text">
						<h2>{article.articleName}</h2>
						<p>{article.articleDescription}</p>
						<p/>
					</div>
				</a>
			{/each}
		</div>
	</div>
</div>
<Footer />

<style lang="scss">
	.wrap {
		margin-top: 60px;

		width: 100%;
		min-height: calc(100vh - 60px);
	}

	.articleWrap {
		position: relative;
		text-decoration: none;
		transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.25s;
		flex-grow: 1;
		padding: 1rem;
		box-sizing: border-box;
		border-left: 1px solid var(--accent50);
		border-right: 1px solid var(--accent50);

		.text {
			text-decoration: none;
			max-width: 30rem;
			box-sizing: border-box;

			& > h2 {
				font-size: 1.75rem;
				margin: 0;
				color: var(--dark);
				transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.5s;
			}
			& > p {
				margin: 0px;
				margin-top: 1rem;
				font-size: 1.2rem;
				line-height: 1.25rem;
				color: var(--mid);
			}
		}
		&:hover .text {
			& > h2 {
				color: var(--accent);
			}
		}
	}

	.alsoLike {
		width: 100%;
		margin-bottom: 1rem;
		display: flex;
		align-items: center;
		justify-content: center;

		.alsoLikeInner {
			width: 90%;
			border-top: 1px solid var(--textLow);
			padding-top: 1rem;
			margin-top: 1rem;
			display: flex;
			flex-direction: column;
			align-items: start;
			justify-content: start;

			h3 {
				font-size: 1.5rem;
				font-weight: 600;
				position: relative;
				padding-left: 0.5rem;

				&::after {
					content: '';
					position: absolute;
					left: 0px;
					top: 0px;
					height: 100%;
					width: 0.25rem;
					background: var(--accent);
				}
			}
		}
	}

	.articles {
		display: flex;
		justify-content: space-between;
		width: 100%;
		flex-wrap: wrap;
	}
</style>
