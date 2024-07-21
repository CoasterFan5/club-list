<div class="articleStyles">
	<slot />
</div>

<style lang="scss">
	.articleStyles :global(p) {
		line-height: 1.5rem;
		overflow-wrap: break-word;
	}

	.articleStyles :global(.tipTapLink) {
		all: unset;
		position: relative;
		color: var(--accent);
		cursor: pointer;
	}

	.articleStyles :global(.tipTapLink::after) {
		content: '';
		position: absolute;
		bottom: 0px;
		left: 0px;
		height: 2px;
		background: var(--accent);
		width: 100%;
		transform: scaleX(0);
		transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.25s;
	}

	.articleStyles :global(.tipTapLink:hover::after) {
		transform: scaleX(1);
	}

	.articleStyles :global(.tipTapImage) {
		margin: 1rem 0;
		width: 100%;
		box-sizing: border-box;
		border-radius: 0.5rem;
	}
</style>
