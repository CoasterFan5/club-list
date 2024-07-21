<script lang="ts">
	import LavaLampBg from '$lib/components/LavaLampBG.svelte';

	export let data;
</script>

<div class="wrap">
	<div class="title">
		<div class="lavaLamp">
			<LavaLampBg addedRadius={200} baseRadius={200} baseVel={1} />
		</div>
		<div class="text2">
			<h1>Clubsaurus Blog</h1>
		</div>
	</div>

	<div class="articles">
		{#each data.articles as article}
			<a class="articleWrap" href="/blog/{article.articleURL}">
				<div class="text">
					<h2>{article.articleName}</h2>
					<p>
						{article.articleDescription}
					</p>
				</div>
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

	.articleWrap {
		position: relative;
		text-decoration: none;
		padding: 1rem;
		transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.25s;

		.text {
			text-decoration: none;
			padding: 1rem;
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

	.title {
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		width: 100%;
		height: 30vh;
		margin: 0;
		border-bottom: 1px solid rgba(0, 0, 0, 0.1);

		.lavaLamp {
			position: absolute;
			top: 0px;
			left: 0px;
			width: 100%;
			height: 100%;
			filter: blur(0px);
		}

		.text2 {
			position: absolute;
			opacity: 1;
			font-size: 3rem;
			color: var(--dark);
			mix-blend-mode: color-burn;
		}
	}
</style>
