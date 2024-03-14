<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import Link from '$lib/components/Link.svelte';

	export let form;
	export let data;
</script>

<div class="wrap">
	<div class="contentWrap">
		<form class="content" action="?/register" method="post" use:enhance>
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
			<input name="joinCode" hidden value={data.code} />
			<span class="inputDiv">
				<Button type="submit" value="Register" />
			</span>
			<p>
				Already have an account? {#if data.code}
					<Link href="/login?invite={data.code}">Log In</Link>
				{:else}
					<Link href="/login">Log In</Link>
				{/if}
			</p>
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
</style>
