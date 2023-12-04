<script lang="ts">
	// why a custom button?
	// keeps everything looking clean
	export let value = 'Button!';
	export let type: HTMLButtonElement['type'] = 'submit';
	export let href: string | undefined = '';
</script>

{#if href}
	<a class="button" {href}>
		{value}
	</a>
{:else}
	<button class="button" {type}>
		{value}
	</button>
{/if}

<style lang="scss">
	.button {
		all: unset;
		background: transparent;
		border: 1px solid gray;
		border-radius: 3px;
		width: 100%;
		padding: 10px;
		box-sizing: border-box;
		font-size: 1.2rem;
		cursor: pointer;
		text-align: center;
		color: var(--textDark);

		&:focus,
		&:hover,
		&:active {
			border: 1px solid var(--accent);
		}
	}
</style>
