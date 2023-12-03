<script lang="ts">
	import { onMount } from 'svelte';
	let height = 0;
	let width = 0;
	let canvas: HTMLCanvasElement;

	type DrawCoords = {
		x: number;
		y: number;
	};
	let lastDraw: DrawCoords | null;

	let draw = (e: MouseEvent) => {
		let context = canvas.getContext('2d');
		if (!context) {
			return;
		}

		if (lastDraw == null) {
			lastDraw = {
				x: e.x,
				y: e.y - Math.round(canvas.getBoundingClientRect().top)
			};
			return;
		}

		context.beginPath();
		context.lineWidth = 1;
		context.strokeStyle = '#e63946';
		context.lineWidth = 5;
		context.lineCap = 'round';
		context.moveTo(lastDraw.x, lastDraw.y);
		context.lineTo(e.x, e.y - Math.round(canvas.getBoundingClientRect().top));

		context.stroke();
		lastDraw = {
			x: e.x,
			y: e.y - Math.round(canvas.getBoundingClientRect().top)
		};
	};

	onMount(() => {
		let context = canvas.getContext('2d');
		if (!context) {
			return;
		}
		context.moveTo(0, 0);
	});
</script>

<div class="connect" bind:clientHeight={height} bind:clientWidth={width}>
	<h2>Clubsaurus helps people express themselves</h2>
	<canvas bind:this={canvas} {height} {width} on:mousemove={draw} />
</div>

<style lang="scss">
	h2 {
		text-align: center;
		padding: 0px 20px;
		font-weight: 500;
		font-size: 2rem;
	}

	.connect {
		width: 100%;
		height: 50vh;
		widows: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		border-bottom: 1px solid black;
	}

	canvas {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0px;
		left: 0px;
		z-index: 10;
	}
</style>
