<script lang="ts">
	import { enhance } from '$app/forms';
	import { tooltip } from '$lib/components/tooltips/tooltip';

	export let role: {
		id: number;
		name: string;
		color: string;
	};

	let colorInput: HTMLInputElement;
	let submitButton: HTMLButtonElement;

	const valueChanged = () => {
		submitButton.click();
	};

	const openColorInput = () => {
		colorInput.click();
	};

	let dotColor = role.color;
</script>

<form
	class="role"
	action="?/updateRole"
	method="post"
	style="--dotColor: {dotColor}"
	use:enhance={() => {
		// Keep all form data
		return async ({ update }) => {
			await update({ reset: false });
		};
	}}
>
	<div class="left" >
		<input name="roleId" hidden value={role.id} />
		<button  class="dot" on:click={openColorInput}>
			<input
				bind:this={colorInput}
				name="color"
				class="colorInput"
				type="color"
				on:change={valueChanged}
				bind:value={dotColor}
			/>
		</button>
		<input
			name="name"
			class="nameBox"
			autocomplete="off"
			placeholder="New Role"
			value={role.name}
			on:change={valueChanged}
		/>
	</div>
	<div class="right">
		<button type="button" class="iconButton" on:click={openColorInput}>
			<img src="/icons/palette.svg" alt="palette" title="Color" use:tooltip={"Color"}>
		</button>
		<button type="button" class="iconButton">
			<img src="/icons/key.svg" alt="key" title="Permissions" use:tooltip={"Permissions"}>
		</button>
	</div>
	

	<button bind:this={submitButton} hidden type="submit" />
</form>

<style lang="scss">
	.left {
		width: 100%;
		flex-wrap: nowrap;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: start;
	}
	.right {
		flex-wrap: nowrap;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: end;
	}
	.role {
		display: flex;
		width: 100%;
		align-items: center;
		justify-content: start;
		background: var(--bgPure);
		padding: 10px 10px;
		box-sizing: border-box;
		border-radius: 3px;
		margin-bottom: 10px;
		box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.1);
	}

	.dot {
		all: unset;
		cursor: pointer;
		height: 20px;
		width: 20px;
		border-radius: 50%;
		aspect-ratio: 1/1;
		background: var(--dotColor);
		margin-right: 10px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.colorInput {
		all: unset;
		height: 1px;
		width: 1px;
		background: transparent;
		position: absolute;
		z-index: -1;
	}

	.nameBox {
		all: unset;
		padding: 0px;
		display: flex;
		text-align: start;
		align-items: start;
		justify-content: start;
		border: 1px solid transparent;
		padding: 3px;
		border-radius: 3px;
		font-size: 1.1rem;

		&:hover {
			border: 1px solid var(--accent50);
		}

		&:focus,
		&:active {
			border: 1px solid var(--accent);
		}
	}

	.iconButton {
		all: unset;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		aspect-ratio: 1/1;
		padding: 5px;
		height: 100%;
		box-sizing: border-box;
		position: relative;
		z-index: 1;
		cursor: pointer;

		&::after {
			content: "";
			position: absolute;
			height: 100%;
			left: 100%;
			top: 0px;
			left: 0px;
			aspect-ratio: 1/1;
			opacity: 0.5;
			border-radius: 5px;
			transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.5s;
		}

		&:hover::after {
			background: var(--dotColor);
			z-index: -1;
		}
	}
	
</style>
