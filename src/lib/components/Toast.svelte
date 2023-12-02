<script lang="ts">
	import { fly } from "svelte/transition";


	import { removeToast, type Toast } from "./toaster";
	import { quintInOut } from "svelte/easing";

	export let data: Toast;
	console.log(data)

	let close = () => {
		console.log("closing")
		console.log(data)
		removeToast(data.id)
	}

	let typeTitles = {
		warn: "Warning",
		error: "Error",
		success: "Success"
	}
</script>

<div class="wrap" transition:fly={{delay: 0, duration: 250, x: 500, y: 0, opacity: 0.5, easing: quintInOut}}>
	<div class="toast">
		
		<h3>{typeTitles[data.type]}</h3>
		<p>{data.message}</p>
		<button class="close" on:click={close}>
			<img src="/icons/x.svg" alt="close">
		</button>
	</div>
	
	
</div>


<style>
	.wrap {
		position: relative;
		margin-top: 10px;
	}
	
	.toast {
		padding: 10px 30px;
		background: var(--bgPure);
		overflow: hidden;
		display: flex;
		flex-direction: column;
		align-items: start;
		justify-content: center;
		border-left: 5px solid var(--accent);
		border-radius: 5px;
		width: 400px;
	}
	h3 {
		margin: 5px 0px;
	}
	p {
		margin: 0px;
	}
	.close {
		all: unset;
		cursor: pointer;
		font-size: 1.2rem;
		position: absolute;
		top: 0px;
		right: 0px;
		padding: 2px;
	}
	.close img {
		width: 30px;
	}
</style>