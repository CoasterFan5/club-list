<script lang="ts">
	import { onMount } from 'svelte';
	let height1 = 0;
	let width1 = 0;
	let height2 = 0;
	let width2 = 0;
	let canvas1: HTMLCanvasElement;
	let canvas2: HTMLCanvasElement

	interface DrawCoords {
		x: number;
		y: number;
	}

	let lastDraw: DrawCoords | null;


	onMount(() => {
		canvas1.getContext('2d')?.moveTo(0, 0)
		canvas2.getContext("2d")?.moveTo(0, 0)
	});

	let realDraw = ( point: {x: number, y: number}) => {

		let context1 = canvas1.getContext('2d');
		let context2 = canvas2.getContext('2d');

		if (!context1) {
			return;
		}
		if(!context2) {
			return
		}
		if (lastDraw == null) {
			lastDraw = {...point}
			return;
		}


		context1.fillRect(point.x, point.y, 5, 5)
		context1.stroke();

		context2.lineWidth = 1;
		context2.strokeStyle = '#e63946';
		context2.lineWidth = 5;
		context2.lineCap = 'round';
		context2.moveTo(lastDraw.x, lastDraw.y);
		context2.lineTo(point.x, point.y);
		context2.stroke()


		
		lastDraw = {
			x: point.x,
			y: point.y
		};
		

	}

	let draw1 = (e: MouseEvent) => {
		
		let point = {
			x: e.x - Math.round(canvas1.getBoundingClientRect().left),
			y: e.y - Math.round(canvas1.getBoundingClientRect().top)
		};
		realDraw(point)
	};

	let draw2 = (e: MouseEvent) => {
		let point = {
			x: e.x - Math.round(canvas2.getBoundingClientRect().left),
			y: e.y - Math.round(canvas2.getBoundingClientRect().top)
		};
		realDraw(point)
	};

	
</script>

<div class="connect">
	<div class="header">
		<h2>Clubsaurus connects your organization</h2>
		<p>try moving your mouse quickly on the left and right field</p>
	</div>
	<div class="canvi">
		<div class="canvasWrap" bind:clientHeight={height1}>
			<canvas bind:this={canvas1}  bind:clientWidth={width1} height={height1} width={width1} on:mousemove={draw1} on:mouseleave={() => {lastDraw = null}} />
		</div>
		<div class="canvasWrap" bind:clientHeight={height2}>
			<canvas bind:this={canvas2} bind:clientWidth={width2} height={height2} width={width2} on:mousemove={draw2} on:mouseleave={() => {lastDraw = null}}/>
		</div>
		
		
	</div>
	
</div>

<style lang="scss">

	.connect {
		width: 100%;
		height: 50vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 25px 0px;
		
	}

	.header {
		display: flex;
		align-items: center;
		flex-direction: column;
		h2 {
			text-align: center;
			margin: 0px;
			padding: 0px 10px;
			font-weight: 500;
			font-size: 2rem;
		}
		p {
			margin: 5px;
			opacity: 0.8;
		}
	}

	.canvi {
		display: flex;
		flex-direction: row;
		height: 100%;
		width: 90%;

		
	}

	.canvasWrap {
			
			padding: 10px;
			width: 50%;
			height: 100%;
			box-sizing: border-box;

			canvas {
				width: 100%;
				width: 100%;
				background: var(--bgPure);
				border-radius: 10px;
			}
		}
	

	

	
</style>
