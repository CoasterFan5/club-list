<script lang="ts">
	import { enhance } from '$app/forms';

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
	use:enhance={() => {
		// Keep all form data
		return async ({ update }) => {
			await update({ reset: false });
		};
	}}
>
	<input name="roleId" hidden value={role.id} />
	<button style="--dotColor: {dotColor}" class="dot" on:click={openColorInput}>
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

	<button bind:this={submitButton} hidden type="submit" />
</form>

<style lang="scss">
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
</style>
