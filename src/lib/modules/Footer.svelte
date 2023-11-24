<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { onMount, tick } from 'svelte';
	import { cubicOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';
	import { fade } from 'svelte/transition';

	function refreshScrollable() {
		if (!content) return
		const newVal = content.scrollHeight > window.innerHeight;

		if (newVal !== scrollable) {
			scrollable = newVal;

			if (scrollable) {
				bottom.set(-50);
			} else {
				bottom.set(0);
			}
		}
	}

	export let content: HTMLDivElement;

	let scrollable = false;
	let bottom = tweened(0, {
		duration: 300,
		easing: cubicOut
	});

	onMount(async () => {
		refreshScrollable();
		new ResizeObserver(refreshScrollable).observe(document.documentElement);
		await tick();
		new ResizeObserver(refreshScrollable).observe(content);
	});

	afterNavigate(() => {
		refreshScrollable();
	});
</script>

<svelte:window on:scroll={refreshScrollable} on:resize={refreshScrollable} />

<footer transition:fade class:bottom={!scrollable} style="bottom: {$bottom}px;">
	<div class="inner">
		<div class="left">
			<h2>Clubsaur<span class="emphasize">.</span>us</h2>
		</div>
		<div class="right">
			<a href="https://github.com/CoasterFan5/Clubsaurus">GitHub</a>
			<a href="https://beta.clubsaur.us">Beta</a>
			<a href="/login">Login</a>
			<a href="/get-started">Signup</a>
		</div>
	</div>
</footer>

<style>
	.emphasize {
		color: var(--textDark);
	}

	footer {
		background: var(--bg);
		border-top: 1px solid var(--accent);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 10px 0px;
		width: 100%;
		z-index: 10;
	}

	.bottom {
		position: fixed;
	}

	.inner {
		width: 80%;
		display: flex;
		align-items: center;
		flex-direction: row;
	}
	.left {
		width: 50%;
	}
	h2 {
		color: var(--accent);
		font-weight: 500;
		font-size: 2rem;
	}
	.right {
		width: 50%;
		display: flex;
		align-items: end;
		justify-content: center;
		flex-direction: column;
	}
	.right a {
		color: var(--accent);
		text-decoration: none;
		margin: 2px 0px;
		position: relative;
		font-size: 1rem;
	}
	.right a::after {
		content: '';
		position: absolute;
		bottom: 0px;
		width: 100%;
		height: 2px;
		left: 0px;
		background: var(--accent);
		transform: scaleX(0);
		transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.5s;
	}
	.right a:hover::after {
		transform: scale(1);
	}
</style>
