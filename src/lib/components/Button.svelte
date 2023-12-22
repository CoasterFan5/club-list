<script lang="ts">
	export let value: string;
	export let type: HTMLButtonElement['type'] = 'submit';
	export let href: string | undefined = undefined;
	export let disabled = false;
	export let style = '';
</script>

{#if href !== undefined}
	<a class="button" {href} {style} on:click>
		{value}
	</a>
{:else}
	<button class="button" class:disabled {disabled} {type} {style} on:click>
		{value}
	</button>
{/if}

<style lang="scss">
	.button {
		all: unset;
		background: transparent;
		border: 1px solid var(--accent);
		border-radius: 3px;
		width: 100%;
		padding: 10px 25px;
		box-sizing: border-box;
		font-size: 1.2rem;
		cursor: pointer;
		text-align: center;
		color: var(--accent);
		transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.2s;

		&:focus,
		&:hover,
		&:active {
			color: white;
			background: var(--accent);
		}

		&:disabled {
			cursor: not-allowed;
			opacity: 0.5;
		}
	}
</style>
