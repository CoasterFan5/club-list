<script lang="ts">
	export let value: string;
	export let type: HTMLButtonElement['type'] = 'submit';
	export let href: string | undefined = undefined;
	export let disabled = false;
</script>

{#if href !== undefined}
	<a class="button" {href} on:click>
		{value}
	</a>
{:else}
	<button class="button" {type} on:click disabled={disabled} class:disabled>
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
		padding: 10px 25px;
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

		&:disabled {
			cursor: not-allowed;
			opacity: 0.5;
		}
	}
</style>
