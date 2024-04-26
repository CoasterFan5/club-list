<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';

	export let data;
</script>

<main>
	<div class="card">
		<div class="title">
			You've been invited to join: <span class="accent">{data.org.name}</span>
		</div>
		<div class="options">
			<div class="button">
				{#if data.isLoggedIn}
					<form action="/org?/join" method="POST" use:enhance>
						<input name="joinCode" hidden value={data.joinCode} />
						<Button value="Join" />
					</form>
				{:else}
					<Button href="/login?redirect=invite&code={data.joinCode}" value="Login to Join" />
				{/if}
			</div>
			<span class="or">or</span>
			<div class="button">
				<Button href="/dashboard" value="Go Home" />
			</div>
		</div>
	</div>
</main>

<style lang="scss">
	.title {
		display: flex;
		flex-direction: column;
		margin: 25px 0px;

		span {
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 3rem;
			margin-top: 5px;
		}
	}
	.button {
		min-width: 350px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.options {
		display: flex;
		flex-direction: row;
		gap: 0.5rem;
		align-items: center;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
	}

	.accent {
		color: var(--accent);
	}

	.or {
		text-align: center;
		font-size: 1.5rem;
		padding: 0px 25px;
		width: 100%;
	}

	main {
		box-sizing: border-box;
		padding: 2rem;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		height: 100vh;
	}

	.card {
		display: flex;
		flex-direction: column;
		text-align: center;
		background: var(--bgMid);
		padding: 25px;
		border-radius: 5px;
		box-sizing: border-box;
		box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.1);
	}
</style>
