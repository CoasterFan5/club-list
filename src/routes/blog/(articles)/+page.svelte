<script lang="ts">
	import LavaLampBg from '$lib/components/LavaLampBG.svelte';
	let showingLavaLamp = false;

	export let data;

	let lavaLampHolder: HTMLDivElement;

	const configureLavaLampPosition = (e: MouseEvent) => {
		showingLavaLamp = true;
		(e.target as HTMLElement).appendChild(lavaLampHolder);
	};

	const hideLavaLamp = (e: MouseEvent) => {
		showingLavaLamp = false;
	};
</script>

<div bind:this={lavaLampHolder} class="lavaLamp" hidden={!showingLavaLamp}>
	<LavaLampBg />
</div>

<div class="wrap">
	<h2>Clubsaurus Blog</h2>
	<div class="articles">
		{#each data.articles as article}
			<a
				class="articleWrap"
				href="/blog/{article.articleURL}"
				on:mouseenter={configureLavaLampPosition}
				on:mouseleave={hideLavaLamp}
			>
				<div class="text">
					<h2>{article.articleName}</h2>
					<p>
						This will be the article description, however, I have not yet added short article
						descriptions.
					</p>
					<div class="text2">
						<h2>{article.articleName}</h2>
						<p>
							This will be the article description, however, I have not yet added short article
							descriptions.
						</p>
					</div>
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
			transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.25s;

			& > h2 {
				font-size: 1.75rem;
				margin: 0;
				color: var(--dark);
				opacity: 0;
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
			mix-blend-mode: color-burn;

			& > h2 {
				opacity: 0.3;
			}

			& > p {
				opacity: 0.3;
			}
		}

		.text2 {
			color: rgb(255, 0, 0);
			text-decoration: none;
			padding: 2rem;
			box-sizing: border-box;
			transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.25s;
			z-index: -2;
			position: absolute;
			top: 0px;
			left: 0px;

			& > h2 {
				font-size: 1.75rem;
				margin: 0;
				color: var(--dark);
			}
			& > p {
				margin: 0px;
				margin-top: 1rem;
				font-size: 1.2rem;
				line-height: 1.25rem;
				color: var(--mid);
			}
		}
	}

	.lavaLamp {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		z-index: -1;
		border-radius: 0.25rem;
		overflow: hidden;
	}
</style>
