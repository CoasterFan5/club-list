<script lang="ts">
	import { cubicIn, cubicOut } from 'svelte/easing';
	import { fly, type FlyParams } from 'svelte/transition';
	import { Hamburger } from 'svelte-hamburgers';

	let innerWidth = 0;
	let hamburgerLinks: boolean;

	$: hamburgerLinks = innerWidth <= 800;
	let hamburgerShowing = false;

	let closeClick = () => {
		hamburgerShowing = false;
	};

	let inTransition: FlyParams = { easing: cubicOut, x: 10, duration: 300, delay: 400 };
	let outTransition: FlyParams = { easing: cubicIn, x: -10, duration: 300 };
</script>

<svelte:window bind:innerWidth />
<nav class="wrap">
	<div class="inner">
		<h1>
			<a class="title" href="/">Clubsaur<span class="highlight">.</span>us</a>
		</h1>
		{#if hamburgerLinks}
			<div class="links">
				<Hamburger --color="white" bind:open={hamburgerShowing} />
			</div>
		{/if}
		{#if !hamburgerLinks || hamburgerShowing}
			<div
				class:hamburgerMenu={hamburgerLinks}
				class="links"
				in:fly={inTransition}
				out:fly={outTransition}
			>
				<a on:click={closeClick} href="/login">Log In</a>
				<a on:click={closeClick} href="/get-started">Get Started</a>
				{#if hamburgerLinks}
					<a href="##" on:click={closeClick}>Close</a>
				{/if}
			</div>
		{/if}
	</div>
</nav>

<style lang="scss">
	.highlight {
		position: relative;
		transform: translateY(0);
		transition: transform 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
		color: var(--accent);
		display: inline-block;
	}

	.title:hover > .highlight {
		transform: translateY(-0.4rem);
	}

	.wrap {
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		position: sticky;
		top: 0px;
		left: 0px;
		z-index: 65000;
		background: var(--mid);
		height: 60px;

		.inner {
			width: 80%;
			height: 100%;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;

			h1 {
				font-size: 2rem;
				color: var(--text);
				margin: 10px;
				font-weight: 400;

				a {
					text-decoration: none;
					color: var(--text);
				}
			}
		}
	}

	.links {
		right: 0;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;

		a {
			margin-left: 15px;
			font-size: 1.2rem;
			text-decoration: none;
			color: var(--text);
			position: relative;

			&::after {
				content: '';
				position: absolute;
				bottom: 0px;
				left: 0;
				width: 100%;
				height: 2px;
				background: var(--accent);
				transform: scaleX(0);
				transform-origin: center;
				transition: transform 0.3s ease-in-out;
			}

			&:hover::after {
				transform: scaleX(1);
			}
		}
	}

	.hamburgerMenu {
		display: block;
		position: absolute;
		padding: 10px;
		box-sizing: border-box;
		top: 60px;
		left: 0px;
		width: 100%;
		display: flex;
		flex-direction: column;
		color: var(--text);

		a {
			padding: 10px;
		}

		&::after {
			content: '';
			background: var(--mid);
			position: absolute;
			width: 100%;
			height: 100%;
			opacity: 0.9;
			padding: 20px 0px;
			top: 0px;
			left: 0px;
			z-index: -1;
		}
	}
</style>
