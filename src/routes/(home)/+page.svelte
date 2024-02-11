<script lang="ts">
	import Button from '$lib/components/Button.svelte';

	import Connect from './Connect.svelte';
	import Organize from './Organize.svelte';
	import Simplify from './Simplify.svelte';
	import You from './You.svelte';
</script>

<div class="wrap">
	<div class="title">
		<h1>Clubs are hard,</h1>
		<h1>
			We make it easy<span class="coolText">.</span>
		</h1>
		<div class="button">
			<Button style="font-size: 1.5rem" href="/get-started" value="Get Started" />
		</div>
	</div>
	<Simplify />
	<Connect />
	<Organize />
	<!-- Nothing here yet, will become testimonials -->
	<You />
</div>

<style lang="scss">
	h1 {
		text-align: center;
		padding: 0px 5rem;
	}

	.wrap {
		width: 100%;
	}

	.title {
		height: 85vh;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
	}

	.button {
		margin-top: 2rem;
	}

	.title h1 {
		margin: 0px;
		font-weight: 500;
		font-size: 3rem;
	}

	.coolText {
		color: var(--accent);
	}
</style>
