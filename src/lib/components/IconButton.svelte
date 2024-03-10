<script lang="ts">
	import { enhance } from '$app/forms';

	/**
	 * Href and formData are not compatible, use one or the other.
	 */
	export let href: string | undefined = undefined;

	/**
	 * Href and formData are not compatible, use one or the other.
	 */
	export let formData:
		| {
				method: HTMLFormElement['method'];
				action: HTMLFormElement['action'];
		  }
		| undefined = undefined;
</script>

{#if href}
	<a class="iconButton" {href} on:click>
		<slot />
	</a>
{:else if formData}
	<form class="formButton" action={formData.action} method={formData.method} use:enhance>
		<button class="iconButton" on:click>
			<slot />
		</button>
	</form>
{:else}
	<button class="iconButton" on:click>
		<slot />
	</button>
{/if}

<style lang="scss">
	.iconButton {
		all: unset;
		cursor: pointer;
		padding: 5px;
		height: 100%;
		box-sizing: border-box;
		margin: 0px;
		aspect-ratio: 1/1;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.25s;

		&:hover {
			background: var(--accent50);
		}

		svg {
			height: 100%;
		}
	}

	.formButton {
		all: unset;
		cursor: pointer;
		aspect-ratio: 1/1;
		height: 100%;
	}

	:global(.iconButton svg) {
		height: 100%;
		width: 100%;
	}
</style>