<script lang="ts">
	import type { ActionData } from './$types';
	import Input from '$lib/components/Input.svelte';
	import Button from '$lib/components/Button.svelte';
	import { enhance } from '$app/forms';

	export let form: ActionData;
</script>

<div class="wrap">
	<div class="contentWrap">
		<form use:enhance class="content" method="post" action="?/register">
			<h1>Register</h1>
			<span class="inputDiv">
				<Input name="email" label="Email" type="email" />
			</span>
			<span class="inputDiv">
				<Input name="firstName" label="First Name" />
			</span>
			<span class="inputDiv">
				<Input name="lastName" label="Last Name" />
			</span>
			<span class="inputDiv">
				<Input name="password" label="Password" type="password" />
			</span>
			<span class="inputDiv">
				<Input name="confirmPassword" label="Confirm Password" type="password" />
			</span>
			<span class="inputDiv">
				<Button value="Register" type="submit" />
			</span>
			<p>Already have an account? <a href="/login">Log In</a></p>
			{#if form?.success == false}
				<p class="error">Error: {form?.message}</p>
			{/if}
		</form>
	</div>
</div>

<style lang="scss">
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

		&::after {
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

		&:hover::after {
			transform: scaleX(1);
		}
	}
</style>
