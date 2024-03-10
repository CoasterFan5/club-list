<script lang="ts">
	export let type: HTMLButtonElement['type'] = 'button';
</script>

<button class="textButton" {type} on:click><slot /></button>

<style lang="scss">
	.textButton {
		all: unset;
		position: relative;
		cursor: pointer;
		color: var(--accent);
		margin-left: 5px;
		padding: 0px 2px;
		z-index: 5;

		&::after {
			content: '';
			position: absolute;
			width: 100%;
			height: 2px;
			bottom: 0px;
			left: 0px;
			background: var(--accent);
			transform: scaleX(0);
			transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.5s;
		}

		&:hover::after {
			transform: scaleX(1);
			z-index: -1;
		}
	}
</style>