<script lang="ts">
	import { enhance } from '$app/forms';

	import { tooltip } from './tooltips/tooltip';

	export let toolTipText: string | undefined = undefined;

	/**
	 * Href and formData are not compatible, use one or the other.
	 */
	export let href: string | undefined = undefined;
	export let disabled: boolean = false;

	/**
	 * Href and formData are not compatible, use one or the other.
	 */
	export let formData:
		| {
				method: HTMLFormElement['method'];
				action: HTMLFormElement['action'];
		  }
		| undefined = undefined;
	export let type: HTMLButtonElement['type'] = 'submit';
</script>

{#if disabled}
	<div class="wrap disabled">
		<span class="iconButton disabled">
			<slot />
		</span>
	</div>
{:else}
	<div class="wrap" use:tooltip={toolTipText}>
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
			<button class="iconButton" {type} on:click>
				<slot />
			</button>
		{/if}
	</div>
{/if}

<style lang="scss">
	.wrap {
		height: 100%;
		aspect-ratio: 1/1;
		box-sizing: border-box;
	}
	.iconButton {
		all: unset;
		cursor: pointer;
		height: 100%;
		aspect-ratio: 1/1;
		box-sizing: border-box;
		margin: 0px;
		padding: 5px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.25s;

		&:hover {
			background: var(--accent50);
		}
	}

	.formButton {
		all: unset;
		cursor: pointer;
		aspect-ratio: 1/1;
		height: 100%;
	}

	.disabled {
		opacity: 0.5;
		cursor: not-allowed !important;
	}

	:global(.iconButton svg) {
		height: 100%;
		width: 100%;
	}
</style>
