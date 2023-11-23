<script lang="ts">
	import type { ActionData } from './$types';

	import Input from '$lib/components/Input.svelte';
	import Button from '$lib/components/Button.svelte';
	import { enhance } from '$app/forms';
	export let form: ActionData;
</script>

<div class="wrap">
	<div class="contentWrap">
		<form use:enhance class="content" method="post" action="?/login">
			<h1>Login</h1>
			<span class="inputDiv">
				<Input name="email" label="Email" />
			</span>
			<span class="inputDiv">
				<Input name="password" label="Password" type="password" />
			</span>
			<span class="inputDiv">
				<Button value="Log In" type="submit" />
			</span>
			<p>No account? <a href="/get-started">Sign Up</a></p>
			{#if form?.success == false}
				<p class="error">Error: {form?.message}</p>
			{/if}
		</form>
	</div>
</div>

<style>
	.wrap {
		width: 100%;
		height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: start;
	}
	.contentWrap {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.content {
		max-width: 350px;
		width: 100%;
		padding: 20px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		border-radius: 10px;
	}
	.inputDiv {
		margin: 7px;
		width: 100%;
	}
	.error {
		margin: 0px;
		color: red;
	}
	a {
		color: var(--accent);
		position: relative;
		text-decoration: none;
	}
	a::after {
		content: '';
		position: absolute;
		bottom: 0px;
		left: 0px;
		width: 100%;
		height: 2px;
		transform: scaleX(0);
		background: var(--accent);
		transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.3s;
	}
	a:hover::after {
		transform: scaleX(1);
	}
</style>
