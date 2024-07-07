<script lang="ts">
	import { page } from '$app/stores';
	import Footer from '$lib/components/home/Footer.svelte';
	import Navbar from '$lib/components/home/Navbar.svelte';
</script>

<Navbar />
{#key $page.url}
	<div class="wrap">
		<slot />
	</div>
{/key}
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

	.articles {
		display: flex;
		justify-content: space-between;
		width: 100%;
		flex-wrap: wrap;
	}
</style>
