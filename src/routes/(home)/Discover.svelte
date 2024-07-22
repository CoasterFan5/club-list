<script lang="ts">
	import Chance from 'chance';
	import type { ComponentType } from 'svelte';
	import { inview } from 'svelte-inview';

	import FootBallIcon from '~icons/bx/ball';
	import BasketballIcon from '~icons/bx/basketball';
	import CodeIcon from '~icons/bx/code';
	import GameIcon from '~icons/bx/game';
	import MathIcon from '~icons/bx/math';
	import ArtIcon from '~icons/bx/paint';
	import RocketIcon from '~icons/bx/rocket';

	export let seed;

	const chance = new Chance(seed);

	const fakeClubs = [
		'Not a club',
		'Still not a club',
		'This is nothing',
		"Don't mind me",
		'Wow, so empty',
		'Is this a club',
		'No club here'
	];

	const icons: ComponentType[] = [
		FootBallIcon,
		BasketballIcon,
		MathIcon,
		GameIcon,
		CodeIcon,
		ArtIcon,
		RocketIcon
	];

	const realClubs: {
		name: string;
		icon: ComponentType;
		color: string;
	}[] = [
		{
			name: 'Football club',
			icon: FootBallIcon,
			color: '#a85a32'
		},
		{
			name: 'Sports club',
			icon: BasketballIcon,
			color: '#32a883'
		},
		{
			name: 'Math club',
			icon: MathIcon,
			color: '#307fbf'
		},
		{
			name: 'Board game club',
			icon: GameIcon,
			color: '#ab9b0e'
		},
		{
			name: 'Coding club',
			icon: CodeIcon,
			color: 'var(--accent)'
		},
		{
			name: 'Art club',
			icon: ArtIcon,
			color: '#6e30a1'
		},
		{
			name: 'Rocket club',
			icon: RocketIcon,
			color: '#ba2575'
		}
	];

	const clubDisplays: {
		name: string;
		color: string;
		icon: ComponentType;
		real: boolean;
	}[] = generateClubDisplays();

	function generateClubDisplays() {
		let clubs = Array(100)
			.fill(0)
			.map(() =>
				// TODO: Should we do a real club display thing?
				({
					name: chance.pickone(fakeClubs),
					icon: chance.pickone(icons),
					color: chance.pickone(realClubs).color,
					real: false
				})
			);

		for (const realClub of realClubs) {
			const randomIndex = Math.floor(chance.floating({ min: 0, max: 1 }) * clubs.length);
			clubs[randomIndex] = { ...realClub, real: true };
		}

		return clubs;
	}

	let effect = false;
</script>

<div class="simplify">
	<h2>Find what's important.</h2>
	<div
		class="simplifyText"
		on:inview_enter={() => {
			effect = true;
		}}
		use:inview={{ rootMargin: '-50%' }}
	>
		{#each clubDisplays as clubDisplay}
			<div
				style="--color: {clubDisplay.color}"
				class="miniClub"
				class:hidden={!clubDisplay.real && effect}
			>
				<div class="icon">
					<svelte:component
						this={clubDisplay.icon}
						color={clubDisplay.color}
						height="100%"
						width="100%"
					/>
				</div>
				<p>{clubDisplay.name}</p>
			</div>
		{/each}
	</div>
</div>

<style lang="scss">
	h2 {
		text-align: center;
	}

	.simplify {
		display: flex;
		flex-direction: column;
		max-height: 40vh;
		overflow-y: hidden;
	}

	.simplifyText {
		display: flex;
		align-items: center;
		justify-content: space-evenly;
		flex-wrap: wrap;
		box-sizing: border-box;
		max-height: calc(2.5rem * 6);
	}

	.miniClub {
		padding: 0.25rem;
		box-sizing: border-box;
		height: 2.5rem;
		display: flex;
		border-radius: 5px;
		flex-direction: row;
		align-items: center;
		justify-content: start;
		background: var(--bgPure);
		margin: 0.25rem;
		transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 5s;

		p {
			margin: 0px;
			padding: 0px 0.25rem;
		}

		.icon {
			padding: 0.25rem;
			height: 2rem;
			width: 2rem;
			box-sizing: border-box;

			display: flex;
			align-items: center;
			justify-content: center;
			position: relative;
			z-index: 1;

			&::after {
				position: absolute;
				content: '';
				height: 100%;
				width: 100%;
				left: 0px;
				top: 0px;
				background: var(--color);
				z-index: -1;
				opacity: 0.25;
				border-radius: 5px;
			}
		}
	}

	.hidden {
		opacity: 0.1;
	}
</style>
