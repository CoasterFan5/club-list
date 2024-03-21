<script lang="ts">
	import Button from '$lib/components/Button.svelte';

	import Connect from './Connect.svelte';
	import Dashboard from './Dashboard.svelte';
	import Discover from './Discover.svelte';
	import Simplify from './Simplify.svelte';
	import You from './You.svelte';

	export let data;
</script>

<div class="wrap">
	<div class="title">
		<h1>
			Clubs made <span class="coolText">easy.</span>
		</h1>
		<div class="button">
			<Button style="font-size: 1.5rem" href="/get-started" value="Get Started" />
		</div>
	</div>
	<div class="dashboard">
		<Dashboard />
	</div>

	<Simplify />
	<Connect />
	<Discover seed={data.seed} />
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
		height: 100vh;
		width: 100%;
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
