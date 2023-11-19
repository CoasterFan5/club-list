<script>
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
</script>

<slot />
<title>
	Clubsaur.us
</title>

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
</style>
