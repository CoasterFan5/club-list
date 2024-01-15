<script lang="ts">
	import { cubicOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';
	import { fade } from 'svelte/transition';
	import Link from '$lib/components/Link.svelte';

	let bottom = tweened(0, {
		duration: 300,
		easing: cubicOut
	});
</script>

<footer style="bottom: {$bottom}px;" transition:fade>
	<div class="inner">
		<div class="left">
			<h2>Clubsaur<span class="emphasize">.</span>us</h2>
		</div>
		<div class="right">
			<Link href="https://github.com/CoasterFan5/Clubsaurus">GitHub</Link>
			<Link href="https://beta.clubsaur.us">Beta</Link>
			<Link href="/login">Login</Link>
			<Link href="/get-started">Signup</Link>
		</div>
	</div>
</footer>

<style lang="scss">
	.emphasize {
		color: var(--textDark);
	}

	footer {
		background: var(--bg);
		border-top: 1px solid var(--accent);
		display: flex;
		height: 120px;
		box-sizing: border-box;
		align-items: center;
		justify-content: center;
		padding: 10px 0px;
		width: 100%;
		z-index: 10;
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
</style>
