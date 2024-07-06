<script lang="ts">
	export let data;
	import '../../articles.scss';

	import dayjs from 'dayjs';
	import sanitizeHtml from 'sanitize-html';
	import hljs from "highlight.js"
	import 'highlight.js/styles/github.css';

	import Link from '$lib/components/Link.svelte';
	import { onMount } from 'svelte';
	onMount(() => {
		hljs.highlightAll()
	})
	const keywords = data.article.tagAssignments.map((item) => `${item.tag.tagName}, `).join();
</script>

<svelte:head>
	<meta name="keywords" content={keywords} />
</svelte:head>

<div class="wrap">
	<div class="article">
		<h1>{data.article.articleName}</h1>
		<div class="infoBox">
			<span>{Math.floor(data.article.articleText.split(' ').length / 200)} min read</span>
			<span>{dayjs(data.article.createdAt).format('MM/DD/YY')}</span>
		</div>
		{@html sanitizeHtml(data.article.articleText, {
			allowedClasses: {
				'*': ['*']
			},
			allowedTags: ["img", "h1", "h2", "code", "span", "pre"]
		})}
		<hr />
		<p>
			Clubsaurus is developing the next generation of club management platforms. Our goal is to
			establish a hub for an organization's clubs, with a focus on student leadership, accessible
			information, and security. Pretty cool, right? <Link href="/get-started">Get Started</Link>
		</p>
	</div>
</div>

<style lang="scss">
	.wrap {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.article {
		width: 60ch;
		font-size: 1.2rem;
		padding: 2.5ch;
		box-sizing: border-box;

		h1 {
			margin-bottom: 0;
		}

		.infoBox {
			color: var(--textLow);
			display: flex;
			width: 100%;
			align-items: center;
			justify-content: space-between;
		}
	}
</style>
