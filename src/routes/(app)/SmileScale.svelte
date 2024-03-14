<script lang="ts">
	import MehIcon from '~icons/bx/meh';
	import SadIcon from '~icons/bx/sad';
	import SmileIcon from '~icons/bx/smile';

	let selected = 0;
</script>

<input name="rating" hidden bind:value={selected} />
<div class="wrap">
	<div class="smileScale">
		<button
			style="--color: #e38987"
			class:active={selected == 1}
			type="button"
			on:click={() => (selected = 1)}
		>
			<SadIcon color="var(--color)" height="100%" width="100%" />
		</button>
		<button
			style="--color: #e69a67"
			class:active={selected == 2}
			type="button"
			on:click={() => (selected = 2)}
		>
			<SadIcon color="var(--color)" height="100%" width="100%" />
		</button>
		<button
			style="--color: #cfb44f"
			class:active={selected == 3}
			type="button"
			on:click={() => (selected = 3)}
		>
			<MehIcon color="var(--color)" height="100%" width="100%" />
		</button>
		<button
			style="--color: #9ecf56"
			class:active={selected == 4}
			type="button"
			on:click={() => (selected = 4)}
		>
			<SmileIcon color="var(--color)" height="100%" width="100%" />
		</button>
		<button
			style="--color: #36e789"
			class:active={selected == 5}
			type="button"
			on:click={() => (selected = 5)}
		>
			<SmileIcon color="var(--color)" height="100%" width="100%" />
		</button>
	</div>
</div>

<style lang="scss">
	.wrap {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.smileScale {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;

		button {
			all: unset;
			cursor: pointer;
			flex-grow: 1;
			height: 3rem;
			width: 3rem;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 3rem;
			opacity: 0.4;
			transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.5s;

			&:hover {
				opacity: 1;
			}
		}

		.active {
			opacity: 1;
			position: relative;
			z-index: 2;

			&::after {
				content: '';
				position: absolute;
				height: 100%;
				width: 100%;
				top: 0px;
				left: 0px;
				background: var(--color);
				border-radius: 50%;
				z-index: -1;
				opacity: 0.25;
			}
		}
	}
</style>
