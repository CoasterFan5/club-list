<script lang="ts" generics="k">
	import type { ChangeEventHandler } from 'svelte/elements';

	type Options = [k[], (arg: k) => string, (arg: k) => string | number];

	export let options: Options = [[], () => '', () => 0];

	export let name = 'dropDown';
	export let label = 'Select Option';

	export let placeholder: string = 'Select Option';
	export let value: string = 'cui_default_option';

	export let searchValue = '';
	export let disableSearch = false;

	export let style: string = '';
	export let disabled = false;

	let showingOptions = false;

	const close = () => {
		showingOptions = false;
	};

	let filteredItems = options[0];

	const changeFilter: ChangeEventHandler<HTMLInputElement> = (e) => {
		filteredItems = options[0].filter((item) => {
			if (
				options[1](item)
					.toLowerCase()
					.includes((e.target as HTMLInputElement)?.value.toLowerCase())
			) {
				return item;
			}
		});
	};
</script>

{#if showingOptions}
	<button class="antiClick" type="button" on:mousedown|self={close}> </button>
{/if}

<div class="wrap" {style} class:disabled>
	<label>
		<span class="label">
			{label}
		</span>
		<span class="label labelBG">
			{label}
		</span>

		<!--if we have js, we want a completely new element-->
		<input hidden {name} {value} />
		<button type="button" class="openOptions" on:click={() => (showingOptions = true)}>
			<p>
				{placeholder}
			</p>
			<svg width="24" height="24" viewBox="0 0 24 24" style="fill: var(--cui_text)">
				<path d="M16.293 9.293 12 13.586 7.707 9.293l-1.414 1.414L12 16.414l5.707-5.707z"></path>
			</svg>
		</button>
		{#if showingOptions}
			<div class="options">
				<!-- svelte-ignore a11y-autofocus -->
				{#if !disableSearch}
					<input bind:value={searchValue} on:input={changeFilter} placeholder="Search" autofocus />
				{/if}
				{#if filteredItems.length < 1}
					<p>No Items</p>
				{/if}
				{#each filteredItems as option}
					<button
						class="option"
						on:click={() => {
							close();
							value = options[2](option).toString();
							placeholder = options[1](option);
						}}
					>
						{options[1](option)}
					</button>
				{/each}
			</div>
		{/if}
	</label>
</div>

<style>
	.wrap {
		position: relative;
	}

	.antiClick {
		all: unset;
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0px;
		left: 0px;
		z-index: 9;
	}

	.label {
		height: 20px;
		position: absolute;
		top: -10px;
		left: 10px;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0px 5px;
		font-size: 0.8rem;
		color: var(--textDark);
		opacity: 0.75;
		text-wrap: nowrap;
		z-index: 7;
	}
	.labelBG {
		color: transparent;
		background: var(--bg);
		opacity: 1;
		text-wrap: nowrap;
		z-index: 6;
	}
	label {
		width: 100%;
		height: 100%;
	}
	.openOptions {
		position: relative;
		color: var(--textDark);
		background: transparent;
		border-radius: 3px;
		padding: 10px;
		box-sizing: border-box;
		font-size: 1.2rem;
		cursor: pointer;
		transition: background cubic-bezier(0.075, 0.82, 0.165, 1) 0.5s;
		text-decoration: none;
		width: 100%;
		text-align: left;
		outline: 0px;
		border: 1px solid gray;
		appearance: none;
		-webkit-appearance: none;
		-moz-appearance: none;
		z-index: 2;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	.openOptions:hover {
		border: 1px solid var(--accent50);
	}

	p {
		all: unset;
		overflow-x: hidden;
	}

	svg {
		position: absolute;
		right: 0px;
		padding-right: 3px;
	}

	.options {
		position: absolute;
		width: 100%;
		top: 100%;
		margin-top: 5px;
		background: var(--bg);
		z-index: 10;
		padding: 5px 5px 5px 5px;
		box-sizing: border-box;
		border: 1px solid gray;
		border-radius: 3px;
		max-height: 300px;
		overflow-y: auto;
		z-index: 10;
	}

	.option {
		all: unset;
		width: 100%;
		box-sizing: border-box;
		position: relative;
		padding: 5px 5px;
		font-size: 1.2rem;
		border-radius: 5px;
	}

	.option::after {
		position: absolute;
		width: 100%;
		height: 100%;
		content: '';
		left: 0px;
		top: 0px;
		opacity: 0.1;
		border-radius: 5px;
	}

	.option:hover::after {
		background: var(--textDark);
	}

	.options input {
		width: 100%;
		box-sizing: border-box;
		background: transparent;
		outline: 0px;
		border: 0px;
		font-size: 1.2rem;
		border-bottom: 1px solid gray;
		padding: 5px 5px;
		padding-top: 10px;
		margin-bottom: 5px;
		margin-top: -5px;
		position: sticky;
		top: -5px;
		background: var(--bg);
		z-index: 5;
	}

	.options p {
		all: unset;
		width: 100%;
		box-sizing: border-box;
		position: relative;
		padding: 5px 5px;
		font-size: 1.2rem;
		border-radius: 5px;
		padding-top: 10px;
	}
</style>
