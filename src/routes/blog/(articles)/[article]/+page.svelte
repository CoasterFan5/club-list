<script lang="ts">
	export let data;
	import './articles.scss';

	import sanitizeHtml from 'sanitize-html';
</script>

<div class="wrap">
	<div class="article">
		{@html sanitizeHtml(data.article?.articleText)}
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
	}
</style>
