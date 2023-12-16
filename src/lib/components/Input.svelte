<script lang="ts">
	export let name = 'Input';
	export let label = 'Input';
	export let bgColor = 'var(--bg)';
	export let type: 'password' | 'email' | undefined = undefined;
	export let required = false;
	export let autocomplete: HTMLInputElement['autocomplete'] | null = null;

	export let value: string = '';

	let active = false;
</script>

<label style="--background-color: {bgColor}" class:active>
	<input {name} {autocomplete} placeholder=" " {required} bind:value {...{ type }} />
	<span class="labelBase">
		{label}
	</span>
</label>

<style lang="scss">
	label {
		position: relative;
		--bezel: 0.5rem;

		span {
			position: absolute;
			left: 0;
			top: 0;
			padding: calc(var(--bezel) * 0.75) calc(var(--bezel) * 0.5);
			margin: calc(var(--bezel) * 2.2 + 3px) calc(var(--bezel) * 0.5);
			background: pink;
			white-space: nowrap;
			transform: translate(0, 0);
			transform-origin: 0 0;
			background: var(--background-color);
			transition: transform 120ms ease-in;
			font-weight: 400;
			line-height: 1.2;
			color: #333;
		}
		input {
			box-sizing: border-box;
			display: block;
			width: 100%;
			border: 1px solid gray;
			padding: calc(var(--bezel) * 1.5) var(--bezel);
			color: currentColor;
			background: transparent;
			border-radius: 4px;

			&:focus,
			&:not(:placeholder-shown) {
				& + span {
					transform: translate(0.25rem, -65%) scale(0.8);
					color: var(--accent);
				}
			}
		}
	}

	.active {
		border: 1px solid var(--accent);
	}
</style>
