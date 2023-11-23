<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
	import ModelHelper from '$lib/modules/ModelHelper.svelte';
	import { dynamicTitle } from '$lib/modules/DashboardNavbar.svelte';
	$dynamicTitle.name = 'Home';
	$dynamicTitle.href = '/';

	let showingCreateModel = false;
	let showingJoinModel = false;
</script>

<ModelHelper bind:showing={showingCreateModel}>
	<form action="?/create" method="post">
		<h2>Organization Name</h2>
		<input placeholder="Organization Name" name="name" />
		<button type="submit">Create</button>
	</form>
</ModelHelper>

<ModelHelper bind:showing={showingJoinModel}>
	<form action="?/join" method="post">
		<h2>Join an Organization</h2>
		<input placeholder="Join Code" name="joinCode" />
		<button type="submit">Join</button>
	</form>
</ModelHelper>

{#if data.user.orgUsers.length < 1}
	<div class="noOrgs">
		<h1>No Joined Organizations</h1>
		<p>
			<button
				class="textButton"
				on:click={() => {
					showingJoinModel = true;
				}}>Join</button
			>
			or
			<button
				on:click={() => {
					showingCreateModel = true;
				}}
				class="textButton">Create</button
			> one!
		</p>
	</div>
{/if}

{#if data.user.orgUsers.length > 0}
	<h1>Joined Organizations</h1>
	<div class="orgList">
		<div class="list">
			{#each data.user.orgUsers as orgUser}
				<a href="/org/{orgUser.organization.id}">{orgUser.organization.name}</a>
			{/each}
		</div>

		<p>
			Not what you want? <button
				class="textButton"
				on:click={() => {
					showingJoinModel = true;
				}}>Join</button
			>
			or
			<button
				on:click={() => {
					showingCreateModel = true;
				}}
				class="textButton">Create</button
			> a new organization
		</p>
	</div>
{/if}

<style>
	.noOrgs {
		text-align: center;
		font-size: 1.2rem;
	}
	.noOrgs h1 {
		margin: 0px;
	}
	.noOrgs p {
		margin-top: 10px;
		font-size: 1.5rem;
	}
	.textButton {
		all: unset;
		cursor: pointer;
		text-decoration: none;
		color: var(--accent);
		position: relative;
	}
	.textButton::after {
		content: '';
		position: absolute;
		bottom: 0px;
		left: 0;
		width: 100%;
		height: 2px;
		background: var(--accent);
		transform: scaleX(0);
		transform-origin: center;
		transition: transform 0.3s ease-in-out;
	}
	.textButton:hover::after {
		transform: scaleX(1);
	}
	h2 {
		margin-top: 0px;
		color: var(--text);
	}
	form {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 50px;
		background: var(--mid);
		backdrop-filter: blur(5px);
		border-radius: 5px;
	}
	input {
		font-size: 1.2rem;
		padding: 10px;
		border-radius: 5px;
		border: 1px solid var(--accent);
		outline: 0px;
		background: var(--accent50);
		color: var(--text);
		margin-bottom: 15px;
	}
	input::active {
		border: 1px solid var(--accent);
	}
	button {
		cursor: pointer;
		font-size: 1.2rem;
		width: 100%;
		padding: 10px;
		border-radius: 5px;
		border: 1px solid var(--accent);
		outline: 0px;
		background: var(--accent50);
		color: var(--text);
	}
	.orgList {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: start;
	}
	.orgList .list {
		width: 80%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: start;
		justify-content: center;
	}
	.orgList .list a {
		font-size: 1.2rem;
		margin-bottom: 15px;
		width: 100%;
		padding: 20px;
		background: var(--dark);
		border-radius: 5px;
		color: var(--text);
	}
	.orgList .list a:hover {
		background: var(--mid);
	}
	.orgList p {
		margin-top: 10px;
		font-size: 1.2rem;
	}
</style>
