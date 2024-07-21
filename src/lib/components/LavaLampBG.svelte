<script lang="ts">
	import { onMount } from 'svelte';

	export let orbCount = 25;
	export let baseRadius = 50;
	export let addedRadius = 50;
	export let baseVel = 0.5;
	export let addedVel = 0.5;

	export let alphaThreshold = 200;

	let canvasWidth: number;
	let canvasHeight: number;

	let skipInitialTesting = false;
	let disabledAnimation = false;

	let canvasElement: HTMLCanvasElement;
	let fakeCanvas: HTMLCanvasElement;

	let context: CanvasRenderingContext2D | null;
	let finalContext: CanvasRenderingContext2D | null;
	$: if (canvasElement) {
		context = fakeCanvas.getContext('2d');
		finalContext = canvasElement.getContext('2d');
	}

	class Orb {
		x: number;
		y: number;
		xVelocity: number;
		yVelocity: number;
		radius: number;
		gradient: CanvasGradient;
		constructor() {
			this.x = Math.random() * canvasWidth;
			this.y = Math.random() * 150;
			this.radius = baseRadius + addedRadius * Math.random();

			let color = 'hsla(355, 78%, light%, alp)'.replace(
				'light',
				(56 + (Math.floor(Math.random() * 40) - 20)).toString()
			);
			this.gradient = context?.createRadialGradient(0, 0, 0, 0, 0, this.radius) as CanvasGradient;
			this.gradient.addColorStop(0, color.replace('alp', `1`));
			this.gradient.addColorStop(1, color.replace('alp', `0`));

			let radiant = Math.random() * Math.PI * 2;
			let velocity = baseVel + addedVel * Math.random();

			this.xVelocity = Math.cos(radiant) * velocity;
			this.yVelocity = Math.sin(radiant) * velocity;
		}

		step() {
			if (!context) {
				return;
			}

			this.x += this.xVelocity;
			this.y += this.yVelocity;

			let radius = this.radius / 2;

			if (this.x < -radius || this.x > canvasWidth + radius) {
				this.xVelocity = this.xVelocity * -1;
			}

			if (this.y < -radius || this.y > canvasHeight + radius) {
				this.yVelocity = this.yVelocity * -1;
			}

			context.fillStyle = this.gradient;
			context.translate(this.x, this.y);
			context.beginPath();
			context.arc(0, 0, this.radius, 0, Math.PI * 2);
			context.fill();
			context.translate(-this.x, -this.y);
		}
	}

	const orbs: Orb[] = [];

	let animation = () => {
		if (!disabledAnimation) {
			window.requestAnimationFrame(animation);
		}

		if (!context || !finalContext) {
			return;
		}

		if (!skipInitialTesting) {
			//Tests if a user has privacy settings enabled which will disable getting data form canvas, this will cause a strobe if its enabled so we just disable the animation

			context.fillStyle = 'black';
			context.rect(0, 0, 1, 1);
			if (context.getImageData(0, 0, 1, 1).data.toString() != '0,0,0,0') {
				disabledAnimation = true;
				finalContext.fillStyle = '#ffffff';
				finalContext.rect(0, 0, canvasWidth, canvasHeight);
				finalContext.fill();
			}
			skipInitialTesting = true;
		}

		if (orbs.length == 0) {
			for (let i = 0; i < orbCount; i++) {
				orbs.push(new Orb());
			}
		}

		context.clearRect(0, 0, canvasWidth, canvasHeight);
		finalContext.clearRect(0, 0, canvasWidth, canvasHeight);

		for (let i = 0; i < orbs.length; i++) {
			orbs[i].step();
		}

		let image = context.getImageData(0, 0, canvasWidth, canvasHeight);

		let imageData = new Uint8Array(image.data.buffer);

		for (let i = 3; i < imageData.length; i += 4) {
			imageData[i] /= imageData[i] < alphaThreshold ? 6 : 1;
		}

		if (image != image) {
			disabledAnimation = true;
		}

		finalContext.putImageData(image, 0, 0);

		//If we have disabled the animation, we just set the color to white to keep it looking in line
		if (disabledAnimation) {
			finalContext.fillStyle = '#f1f1f1';
			finalContext.rect(0, 0, canvasWidth, canvasHeight);
			finalContext.fill();
		}
	};

	onMount(() => {
		animation();
	});
</script>

<canvas bind:this={fakeCanvas} height={canvasHeight} hidden width={canvasWidth} />
<canvas
	bind:this={canvasElement}
	id="final"
	height={canvasHeight}
	width={canvasWidth}
	bind:clientHeight={canvasHeight}
	bind:clientWidth={canvasWidth}
/>

<style lang="scss">
	canvas {
		background: transparent;
		margin-bottom: 1rem;
		width: 100%;
		height: 100%;
	}
</style>
