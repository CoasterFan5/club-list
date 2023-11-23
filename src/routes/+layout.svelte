<script lang="ts">
	import '@fontsource/work-sans/100.css';
	import '@fontsource/work-sans/200.css';
	import '@fontsource/work-sans/300.css';
	import '@fontsource/work-sans/400.css';
	import '@fontsource/work-sans/500.css';
	import '@fontsource/work-sans/600.css';
	import '@fontsource/work-sans/700.css';
	import '@fontsource/work-sans/800.css';
	import '@fontsource/work-sans/900.css';
	import '@fontsource-variable/source-code-pro';
	import type { LayoutData } from './$types';

	export let data: LayoutData;
	let showBeta = true;
</script>

{#if data.beta && showBeta}
	<button
		class="betaWarning"
		on:click={() => {
			showBeta = true;
		}}
	>
		<p>
			This a beta version! For production ready version, go here: <a href="https://clubsaur.us"
				>Clubsaur.us</a
			>
		</p>
	</button>
{/if}

<slot />
<title> Clubsaur.us </title>

<style>
	:global(html) {
		font-family: 'Work Sans', sans-serif;
		--text: #f1f1f1;
		--textLight: #f1f1f1;
		--textDark: #202020;
		--dark: #202020;
		--mid: #333533;
		--bg: #f1f1f1;
		--bgPure: #ffffff;
		--accent: #e63946;
		--accent50: rgba(230, 57, 70, 0.5);
	}
	:global(body) {
		margin: 0;
		background: var(--bg);
	}
	:global(.mono) {
		font-family: 'Source Code Pro Variable', sans-serif;
	}
	.betaWarning {
		all: unset;
		font-family: 'Work Sans', sans-serif;
		border: 0px;
		text-align: center;
		background: var(--accent);
		color: var(--bg);
		right: 0px;
		bottom: 0px;
		z-index: 10000;
		position: fixed;
		padding: 5px;
		border-radius: 5px;
		margin: 5px;
	}
	.betaWarning a {
		color: var(--bg);
	}
</style>
