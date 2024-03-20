<script lang="ts">
	import calIcon from "~icons/bx/calendar";
	import roleIcon from "~icons/bx/key";
	import eventIcon from "~icons/bx/clipboard";
	import announceIcon from "~icons/bx/note";
	import userIcon from "~icons/bx/user";
	import openSourceIcon from "~icons/bx/code";

	const cards = [
		{
			title: "Calendar",
			description: "A shared calendar to inform you of all clubs events at a glance!",
			icon: calIcon
		},
		{
			title: "Roles",
			description: "Roles allow you to delegate tasks and promote student leadership!",
			icon: roleIcon
		},
		{
			title: "Events",
			description: "Events create a space to inform people of what is going on with a club.",
			icon: eventIcon
		},
		{
			title: "Announcements",
			description: "have something to say? This is the place! Let everyone know the news.",
			icon: announceIcon
		},
		{
			title: "User First",
			description: "We are dedicated to adding features our users want and need!",
			icon: userIcon
		},
		{
			title: "Open Source",
			description: "View the code that runs Clubsaurus any-time you would like!",
			icon: openSourceIcon
		}
	]
</script>

<div class="wrap">
	<div class="inner">
		<h2>Simplify your organization's clubs</h2>
		<p class="yap">Clubsaurus makes managing clubs in your organization unbelievably easy.</p>
		<div class="features">
			<div class="featureCards">
				<div class="justAnotherCardWrap">
					{#each cards as card}
						<div class="card">
							<div class="icon">
								<svelte:component height="100%" width="100%" this={card.icon}/>
							</div>
							<div class="name">
								<h3>{card.title}</h3>
							</div>
							<div class="text">
								<p>{card.description}</p>
							</div>
						</div>
					{/each}
				</div>
				
				<div class="featureCardBg">

				</div>
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	.wrap {
		padding: 5rem 0px;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
	}

	.inner {
		
		text-align: center;
		width: 100%;

		h2 {
			font-size: 2rem;
		}
	}

	.yap {
		opacity: 0.8;
		font-size: 1.2rem;
	}

	.features {
		margin-top: -100px;
		padding-top: 400px;
		width: 100%;
		background-image: url("/dino");
		background-size: cover;
		background-position-x: center;
		
		
		.featureCards {
			box-sizing: border-box;
			position: relative;
			padding-top: 2px;
			width: 100%;
			padding-bottom: 1rem;
			
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			
			z-index: 1;
			
			.featureCardBg {
				position: absolute;
				height: calc(100% - 7px);
				bottom: 0px;
				left: 0px;
				background: var(--bg);
				width: 100%;
				z-index: -1;

				
			}

			.justAnotherCardWrap {
				margin-top: -0.3rem;
				padding: 0.3rem 0rem;
				width: fit-content;
				display: flex;
				align-items: center;
				overflow-x: auto;
				overflow-y: hidden;

				&::-webkit-scrollbar {
					color: transparent;
				}
				
				
			}
			
			

			
		}
	}


	.card {
				background: var(--bgMid);
				box-shadow: 1px 1px 3px 3px rgba(0, 0, 0, 0.1);
				padding: 1rem;
				box-sizing: border-box;
				height: 13rem;
				
				
				
				border-radius: 5px;
				aspect-ratio: 1/1;
				margin: 0px 1rem;
				

				.icon {
					
					display: flex;
					height: 2rem;
					width: 2rem;
					aspect-ratio: 1/1;
					filter: var(--redIconFilter);
					background: rgba(255, 255, 255, 0.2);
					padding: 0.2rem;
					border-radius: 5px;
				}

				h3 {
					text-align: left;
					font-size: 1.3rem;
					font-weight: 500;
					margin: 0.5rem 0px;
				}

				p {
					margin: 0.5rem 0px;
					display: flex;
					text-align: left;
				}
			}
</style>