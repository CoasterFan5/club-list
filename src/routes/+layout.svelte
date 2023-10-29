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
</script>


<slot/>

<style>
	:global(html) {
		font-family: 'Work Sans', sans-serif;
		--text: #252422;
		--textLight: #f1f1f1;
		--dark: #403d39;
		--mid: #ccc5b9;
		--bg: #fffcf2;
		--accent: #eb5e28;
		--accent50: rgba(235, 95, 40, 0.25);
	}
	:global(body) {
		margin: 0;
		background: var(--bg);
	}
</style>

