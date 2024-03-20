<script lang="ts">
	import LockIcon from "~icons/bx/lock-alt"
	import ShieldIcon from "~icons/bx/shield"
	import HideIcon from "~icons/bx/hide"
	import Chevron from "~icons/bx/chevron-down"

	const sections = [
		{
			title: "Security",
			icon: LockIcon,
			color: "#0335fc",
			open: false,
			desc: "At Clubsaurus, we understand the importance of security regarding our users' data. That's why we have prioritized ensuring that we build our platform with the highest level of protection possible. We are proud to say that our entire codebase is open to the public for review and analysis. This openness provides transparency into our security practices and allows us to receive unparalleled feedback from our community of developers who can help us identify and address potential vulnerabilities. Being open about our security practices can create a safer and more trustworthy environment for our users.",
		},
		{
			title: "Moderation",
			icon: ShieldIcon,
			color: "#008a32",
			open: false,
			desc: "Moderating user-generated content can be challenging, but with Clubsaurus, it becomes much more manageable. Only authorized users are allowed to post content within a Clubsaurus organization by default. This measure is put in place to protect you and your students from being exposed to harmful content posted by malicious individuals. Moreover, we grant organization administrators the ability to ban any user they deem necessary. This control allows you complete authority over the content posted in your organization and ensures that your community remains safe and secure. ",
		},
		{
			title: "Privacy",
			icon: HideIcon,
			color: "#c77100",
			open: false,
			desc: "At Clubsaurus, we recognize that our users' privacy is essential and are committed to ensuring it is always protected. That is why we have developed our platform to offer users a wide range of privacy options. With Clubsaurus, you can decide what data you want to share about yourself and your students. You are in complete control of your information, and we are committed to keeping it safe and secure. Our goal is to provide a safe and enjoyable experience for everyone who uses Clubsaurus, and we believe that privacy is a critical factor in achieving that goal.",
		}
	]

</script>

<div class="wrap">
	<div class="inner">
		<h2>Protect student experience in clubs.</h2>
		{#each sections as section}
			<button class="section" class:active={section.open} style="--color: {section.color};" on:click={() => {section.open = !section.open}} >
				<div class="sectionMain">
					<div class="icon">
						<svelte:component this={section.icon} color={section.color} height="100%" width="100%"/>
					</div>
					<h3>{section.title}</h3>
					<div class="chevron">
						<Chevron height="100%" width="100%"/>
					</div>
				</div>
				
				{#if section.open}
				<div>
					<p>{section.desc}</p>
				</div>
				{/if}
				
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
		
		padding-left: 1rem;
		margin: 0.3rem 0px;
		border-radius: 5px;
		background: var(--bgMid);
		box-shadow: 1px 1px 3px 3px rgba(0, 0, 0, 0.05);
		transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.5s;
		cursor: pointer;

		.sectionMain {
			display: flex;
		align-items: center;
		}
		
		&:hover {
			background: var(--bgPure);
			box-shadow: 1px 1px 3px 3px rgba(0, 0, 0, 0.1);
		}
		
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
			transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.5s;
		}

	.active {
		.chevron {
			transform: rotate(180deg);
		}
	}
</style>