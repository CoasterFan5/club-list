<script lang="ts">
	/**
	 * From https://codepen.io/jczimm/pen/vEBpoL (Jacob Zimmerman)
	 *
	 */

	export let size = '50px';
	export let strokeWidth = '3px';
	export let radius = 22;
</script>

<div style="--size: {size}" class="wrap">
	<svg class="spinner" viewBox="25 25 50 50">
		<circle
			class="circle"
			cx="50"
			cy="50"
			fill="none"
			r={radius}
			stroke-miterlimit="10"
			stroke-width={strokeWidth}
		/></svg
	>
</div>

<style lang="scss">
	.wrap {
		position: relative;
		margin: 0 auto;
		width: var(--size);
		&:before {
			content: '';
			display: block;
			padding-top: 100%;
		}
	}

	.spinner {
		animation: rotate 2s linear infinite;
		height: 100%;
		transform-origin: center center;
		width: 100%;
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		margin: auto;
	}

	.circle {
		stroke-dasharray: 1, 200;
		stroke-dashoffset: 0;
		stroke: var(--accent);
		animation: dash 1.5s ease-in-out infinite;
		stroke-linecap: round;
	}

	@keyframes rotate {
		100% {
			transform: rotate(360deg);
		}
	}

	@keyframes dash {
		0% {
			stroke-dasharray: 1, 200;
			stroke-dashoffset: 0;
		}
		50% {
			stroke-dasharray: 89, 200;
			stroke-dashoffset: -35px;
		}
		100% {
			stroke-dasharray: 89, 200;
			stroke-dashoffset: -124px;
		}
	}
</style>
