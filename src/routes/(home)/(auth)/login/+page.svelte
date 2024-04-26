<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import Link from '$lib/components/Link.svelte';

	export let form;
</script>

<div class="wrap">
	<div class="contentWrap">
		<form class="content" action="?/login" method="post" use:enhance>
			<h1>Login</h1>
			<span class="inputDiv">
				<Input name="email" label="Email" />
			</span>
			<span class="inputDiv">
				<Input name="password" label="Password" type="password" />
			</span>
			<input name="hiddenUrlString" hidden value={btoa($page.url.toString())} />
			<span class="inputDiv">
				<Button type="submit" value="Log In" />
			</span>
			<p>
				No account?
				{#if $page.url.searchParams.toString()}
					<Link href="/get-started?{$page.url.searchParams.toString()}">Sign Up</Link>
				{:else}
					<Link href="/get-started">Sign Up</Link>
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
