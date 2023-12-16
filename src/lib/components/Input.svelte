<script lang="ts">
	export let name = 'Input';
	export let label = 'Input';
	export let type: 'password' | 'email' | undefined = undefined;
	export let required = false;
	export let autocomplete: HTMLInputElement['autocomplete'] | null = null;

	export let value: string = '';
</script>

<div>
	<input {name} {autocomplete} placeholder={label} {required} bind:value {...{ type }} />
	<label for={name}>{label}</label>
</div>

<style lang="scss">
	$gray: #9b9b9b;

	div {
		position: relative;
		padding: 15px 0 0;
		width: 100%;
	}

	input {
		font-family: inherit;
		width: 100%;
		border: 0;
		border-bottom: 2px solid #9b9b9b;
		outline: 0;
		font-size: 1.3rem;
		color: black;
		padding: 7px 0;
		background: transparent;
		transition: border-color 0.2s;

		&::placeholder {
			color: transparent;
		}

		&:placeholder-shown ~ label {
			font-size: 1.3rem;
			cursor: text;
			top: 20px;
		}

		&:required,
		&:invalid {
			box-shadow: none;
		}

		&:focus {
			~ label {
				position: absolute;
				top: 0;
				display: block;
				transition: 0.2s;
				font-size: 1rem;
				color: var(--accent);
				font-weight: 700;
			}
			padding-bottom: 6px;
			font-weight: 700;
			border-width: 3px;
			border-image: linear-gradient(to right, var(--accent), var(--accent));
			border-image-slice: 1;
		}
	}

	label {
		position: absolute;
		top: 0;
		display: block;
		transition: 0.2s;
		font-size: 1rem;
		color: $gray;
		pointer-events: none;
	}

	.active {
		border: 1px solid var(--accent);
	}
</style>
