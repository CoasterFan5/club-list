<script lang="ts">
	export let name = "No Text"
	export let real = false;
	import { inview, type Options } from "svelte-inview";
	const options: Options = {
		rootMargin: '-350px'
	};

	let opacity = 0.5;

	const show = () => {
		if(real) {
			opacity = 1;
		} else {
			opacity = 0.1;
		}
	}

</script>

<div class="wrap" use:inview={options} on:inview_enter={show} style="opacity: {opacity}">
	<div class="inner">
		{name}
	</div>
	
</div>

<style lang="scss">
	.wrap {
		transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 5s;
		width: 33%;
		flex-grow: 1;
		min-width: 300px;
		padding: 5px;
		box-sizing: border-box;
		height: 100px;
		
	}
	.inner {
		background: var(--accent50);
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 2rem;
		border-radius: 5px;
	}
</style>