<script lang="ts">
	import type { ComponentType, SvelteComponent } from "svelte";
	import { inview } from "svelte-inview"

	import FootBallIcon from "~icons/bx/ball"
	import BasketballIcon from "~icons/bx/basketball"
	import MathIcon from "~icons/bx/math"
	import GameIcon from "~icons/bx/game"
	import CodeIcon from "~icons/bx/code"
	import ArtIcon from "~icons/bx/paint"
	import RocketIcon from "~icons/bx/rocket"



	const fakeClubs = [
		"Not a club",
		"Still not a club",
		"This is noting",
		"Don't mind me",
		"Wow, so empty",
		"Is this a club",
		"No club here"
	]


	const realClubs = [
		{
			name: "Football club",
			icon: FootBallIcon as ComponentType,
			color: "#a85a32"
		},
		{
			name: "Sports club",
			icon: BasketballIcon as ComponentType,
			color: "#32a883"
		},
		{
			name: "Math club",
			icon: MathIcon as ComponentType,
			color: "#307fbf"
		},
		{
			name: "Board game club",
			icon: GameIcon as ComponentType,
			color: "#ab9b0e"
		},
		{
			name: "Coding club",
			icon: CodeIcon as ComponentType,
			color: "var(--accent)"
		},
		{
			name: "Art club",
			icon: ArtIcon as ComponentType,
			color: "#6e30a1"
		},
		{
			name: "Rocket club",
			icon: RocketIcon as ComponentType,
			color: "#ba2575"
		}
		
	]

	let clubDisplayThing: {
		name: string,
		color: string,
		icon: ComponentType,
		real: boolean,
	}[] = []

	//assemble the items
	for(let i = 0; i < 100; i++) {
		//should we do a real club display thing?
		if(i % realClubs.length == 0) {
			let index = Math.floor(Math.random() * realClubs.length)
			console.log(realClubs[index])
			clubDisplayThing.push({...realClubs[index], real: true})
		} else {
			clubDisplayThing.push({
				name: fakeClubs[Math.floor(Math.random() * fakeClubs.length)],
				icon: realClubs[Math.floor(Math.random() * realClubs.length)].icon,
				color: realClubs[Math.floor(Math.random() * realClubs.length)].color,
				real: false,
			})
		}
	}

	let effect = false;

	
</script>

<div class="simplify">
	<h2>Find what's important.</h2>
	<div class="simplifyText" use:inview={{rootMargin: "-50%"}} on:inview_enter={() => {effect = true}}>
		{#if clubDisplayThing.length > 0}
			{#each clubDisplayThing as clubDisplay}
				<div class="miniClub"   class:hidden={!clubDisplay.real && effect} style="--color: {clubDisplay.color}">
					<div class="icon">
						<svelte:component color="{clubDisplay.color}" width="100%" height="100%" this={clubDisplay.icon}/>
					</div>
					<p>{clubDisplay.name}</p>
				</div>
			{/each}
		{/if}
		
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
	}

	.miniClub {
		padding: 0.25rem;
		box-sizing: border-box;
		display: flex;
		border-radius: 5px;
		flex-direction: row;
		align-items: center;
		justify-content: start;
		background: var(--bgPure);
		margin: 0.25rem;
		transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 3s;
		
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
				content: "";
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

	.shown {
		background: var(--accent50);
		opacity: 1;

		&::after {
			transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 5s;
			opacity: 1;
			border-radius: 100px;
			border: 1px solid var(--accent);
		}
	}
</style>
