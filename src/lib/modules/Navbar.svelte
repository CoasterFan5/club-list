<script lang="ts">
	import { cubicIn, cubicOut } from 'svelte/easing';
	import { fly, type FlyParams } from 'svelte/transition';

	export let dashboard: boolean;

	let inTransition: FlyParams = { easing: cubicOut, x: 10, duration: 300, delay: 400 };
	let outTransition: FlyParams = { easing: cubicIn, x: -10, duration: 300 };
</script>

<nav class="wrap">
	<div class="inner">
		<h1>
			<a class="title" href="/">Clubsaur<span class="highlight">.</span>us</a>
		</h1>
		{#if dashboard}
			<div class="links" in:fly={inTransition} out:fly={outTransition}>
				<a href="/dashboard">Organizations</a>
				<a href="/dashboard/clubs">Clubs</a>
				<a href="/dashboard/profile">Profile</a>
			</div>
		{:else}
			<div class="links" in:fly={inTransition} out:fly={outTransition}>
				<a href="/login">Log In</a>
				<a href="/get-started">Get Started</a>
			</div>
		{/if}
	</div>
</nav>

<style>
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
		position: fixed;
		top: 0px;
		z-index: 65000;
		background: var(--mid);
	}
	.wrap .inner {
		width: 80%;
		height: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}
	.inner h1 {
		font-size: 2rem;
		color: var(--text);
		margin: 10px;
		font-weight: 400;
	}
	.inner h1 a {
		text-decoration: none;
		color: var(--text);
	}
	.links {
		position: absolute;
		right: 0;
		margin-right: 10%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}
	.links a {
		margin-left: 15px;
		font-size: 1.2rem;
		text-decoration: none;
		color: var(--text);
		position: relative;
	}
	.links a::after {
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
	.links a:hover::after {
		transform: scaleX(1);
	}
</style>
