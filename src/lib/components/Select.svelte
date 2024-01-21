<script lang="ts">
	export let name: string | null;
	export let label: string;
	export let value: string;
	export let id: string | null = null;
	export let style = '';
</script>

<div {style} class="wrap">
	<label>
		<span class="label">
			{label}
		</span>
		<span class="labelBG">
			{label}
		</span>
		<select {id} {name} {style} placeholder={label} bind:value on:click on:blur on:focus on:change>
			<slot />
		</select>
	</label>
	<div class="arrow">
		<svg style="fill: var(--textDark)" height="24" viewBox="0 0 24 24" width="24">
			<path d="M16.293 9.293 12 13.586 7.707 9.293l-1.414 1.414L12 16.414l5.707-5.707z" />
		</svg>
	</div>
</div>

<style lang="scss">
	.wrap {
		position: relative;
		width: 100%;
	}
	select {
		position: relative;
		color: black;
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
	}
	select:focus,
	select:active,
	select:hover {
		border: 1px solid var(--accent);
	}
	.arrow {
		position: absolute;
		z-index: 1;
		height: 100%;
		aspect-ratio: 1/1;
		top: 0px;
		right: 0px;
		display: flex;
		align-items: center;
		justify-content: end;
	}
	.arrow svg {
		padding-right: 5px;
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
		color: black;
		opacity: 0.75;
		text-wrap: nowrap;
		z-index: 7;
	}
	.labelBG {
		height: 20px;
		position: absolute;
		top: -10px;
		left: 10px;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0px 5px;
		font-size: 0.8rem;
		color: transparent;
		background: var(--background, var(--bg));
		opacity: 1;
		text-wrap: nowrap;
		z-index: 6;
	}
	.wrap :global(option) {
		background: var(--secondary);
		color: var(--textDark);
		border-radius: 0px;
	}
</style>
