<script lang="ts">
	import SmileIcon from '~icons/bx/smile';
	import MehIcon from '~icons/bx/meh';
	import SadIcon from '~icons/bx/sad';

	let selected = 0;
</script>

<div class="smileScale">
	<button type="submit" class:active={selected == 1} on:click={() => (selected = 1)}>
		<SadIcon width="100%" height="100%" color="#e38987" />
	</button>
	<button type="submit" class:active={selected == 2} on:click={() => (selected = 2)}>
		<SadIcon width="100%" height="100%" color="#e69a67" />
	</button>
	<button type="submit" class:active={selected == 3} on:click={() => (selected = 3)}>
		<MehIcon width="100%" height="100%" color="#cfb44f" />
	</button>
	<button type="submit" class:active={selected == 4} on:click={() => (selected = 4)}>
		<SmileIcon width="100%" height="100%" color="#9ecf56" />
	</button>
	<button type="submit" class:active={selected == 5} on:click={() => (selected = 5)}>
		<SmileIcon width="100%" height="100%" color="#36e789" />
	</button>
</div>

<style lang="scss">
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
		}
	}
</style>
