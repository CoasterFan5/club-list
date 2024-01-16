<script lang="ts">
	export let name: string | null = 'checkbox';
	export let checked = false;
	export let disabled = false;
	export let label = ""
</script>

<label>
	<div class="wrap">
		<input {name} class="checkbox" {disabled} type="checkbox" bind:checked on:click on:input />
		<div class="customBox" />
		<div class="check">
			<svg style="fill: rgb(0, 0, 0)" height="24" viewBox="0 0 24 24" width="24"
				><path d="m10 15.586-3.293-3.293-1.414 1.414L10 18.414l9.707-9.707-1.414-1.414z" /></svg
			>
		</div>
	</div>
	{label}
	
</label>


<style lang="scss">
	.wrap {
		display: block;
		position: relative;
		padding: 10px;
		cursor: pointer;
		margin: 7px;
	}
	.checkbox {
		z-index: 50;
		top: 0px;
		left: 0px;
		width: 100%;
		height: 100%;
		margin: 0px;
		cursor: pointer;
	}
	.customBox {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0px;
		left: 0px;
		box-sizing: border-box;
		padding: 5px;
		border: 1px solid gray;
	}
	.check {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0px;
		left: 0px;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		opacity: 0;
		transition: all cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.25s;
	}
	.wrap .checkbox:checked ~ .check {
		opacity: 1;
		background: var(--accent50);
		transition: all cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.25s;
	}
	.wrap .checkbox:checked ~ .customBox {
		border: 1px solid var(--accent);
	}
	input {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0px;
		left: 0px;
		box-sizing: border-box;
		padding: 5px;
		opacity: 0;
	}
	label {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		cursor: pointer;
	}
</style>
