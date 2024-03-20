<script lang="ts">
	import LockIcon from "~icons/bx/lock-alt"
	import ShieldIcon from "~icons/bx/shield"
	import HideIcon from "~icons/bx/hide"
	import Chevron from "~icons/bx/chevron-down"

	const sections = [
		{
			title: "Security",
			icon: LockIcon,
			color: "#0335fc"
		},
		{
			title: "Moderation",
			icon: ShieldIcon,
			color: "#008a32"
		},
		{
			title: "Privacy",
			icon: HideIcon,
			color: "#c77100"
		}
	]

</script>

<div class="wrap">
	<div class="inner">
		<h2>Protect student experience in clubs.</h2>
		{#each sections as section}
			<button class="section" style="--color: {section.color};" >
				<div class="icon">
					<svelte:component this={section.icon} color={section.color} height="100%" width="100%"/>
				</div>
				<h3>{section.title}</h3>
				<div class="chevron">
					<Chevron height="100%" width="100%"/>
				</div>
				
			</button>
		{/each}
		
		
	</div>
</div>

<style lang="scss">
	.wrap {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 2rem;
	}

	.inner {
		width: 90%;
		min-width: 350px;
		display: flex;
		flex-direction: column;
	}
	.section {
		all: unset;
		display: flex;
		align-items: center;
		padding-left: 1rem;
		margin: 0.3rem 0px;
		border-radius: 5px;
		background: var(--bgMid);
		box-shadow: 1px 1px 3px 3px rgba(0, 0, 0, 0.05);
		transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.5s;
		cursor: pointer;

		
		&:hover {
			background: var(--bgPure);
			box-shadow: 1px 1px 3px 3px rgba(0, 0, 0, 0.1);
		}
		
		.icon {
			margin-right: 0.5rem;
			height: 2rem;
			width: 2rem;
			padding: 0.25rem;
			box-sizing: border-box;
			position: relative;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 5px;
			z-index: 1;
			overflow: hidden;

			&::after {
				content: "";
				position: absolute;
				height: 100%;
				width: 100%;
				left: 0px;
				top: 0px;
				background: var(--color);
				opacity: 0.25;
				z-index: -1;
			}
		}

		h3 {
			font-weight: 400;
			
		}

		.chevron {
			height: 2rem;
			width: 2rem;
			padding: 0.25rem;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			justify-content: center;
			position: relative;
			z-index: 1;
			margin-left: 0.25rem;
		}
	}
</style>