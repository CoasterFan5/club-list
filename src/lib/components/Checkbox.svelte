<script lang="ts">
	export let name = "checkbox"
	export let checked: boolean = false;
</script>

<div class="wrap">
	<input name={name} class="checkbox" type="checkbox" bind:checked on:click on:input/>
	<div class="customBox"></div>
	<div class="check">
		<svg width="24" height="24" viewBox="0 0 24 24" style="fill: rgb(0, 0, 0)"><path d="m10 15.586-3.293-3.293-1.414 1.414L10 18.414l9.707-9.707-1.414-1.414z"></path></svg>
	</div>
</div>


<style>
	.wrap {
		display: block;
		position: relative;
		padding: 10px;
		cursor: pointer;
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
	.wrap .checkbox:checked ~ .check  {
		opacity: 1;
		background: var(--accent50);
		transition: all cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.25s;
	}
	.wrap .checkbox:checked ~ .customBox {
		border: 1px solid var(--accent)
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
</style>