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
	import Toaster from '$lib/components/Toaster.svelte';
	import { addToast, resetToast } from '$lib/components/toaster';
	export let data: LayoutData;

	let sent = false;
	resetToast();
	if (data.beta && !sent) {
		addToast({
			message:
				'You are on a beta version. <a href="https://clubsaur.us">Click here to go to the main site.</a>',
			type: 'warn'
		});
		sent = true;
	}
</script>

<svelte:head>
	<title>Clubsaur.us</title>
</svelte:head>

<div class="wrap">
	<slot />
</div>

<Toaster />

<style lang="scss">
	.wrap {
		min-height: calc(100vh);
		width: 100%;
		display: flex;
		flex-direction: column;
	}

	:global(html) {
		font-family: 'Work Sans', sans-serif;
		--text: #f1f1f1;
		--textLight: #f1f1f1;
		--textDark: #202020;
		--dark: #202020;
		--mid: #333533;
		--bg: #f1f1f1;
		--bgMid: #f8f8f8;
		--bgPure: #ffffff;
		--accent: #e63946;
		--accent50: rgba(230, 57, 70, 0.5);
		--redIconFilter: invert(45%) sepia(57%) saturate(7438%) hue-rotate(337deg) brightness(94%)
			contrast(92%);
	}

	:global(body) {
		margin: 0;
		background: var(--bg);
	}

	:global(.ProseMirror-focused) {
		outline: 0px;
	}

	:global(.mono) {
		font-family: 'Source Code Pro Variable', sans-serif;
	}
</style>
