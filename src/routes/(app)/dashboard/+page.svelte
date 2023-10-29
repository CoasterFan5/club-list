

<script lang="ts">
	import type { PageData } from "./$types";
	export let data: PageData;
	import ModelHelper from "$lib/modules/ModelHelper.svelte";

	let showingCreateModel = false;
	let showingJoinModel = false;
</script>

<ModelHelper bind:showing={showingCreateModel}>
	<form name="?/create" method="post">
		<h2>Club Name</h2>
		<input placeholder="Organization Name"/>
		<button>Create</button>
	</form>
</ModelHelper>

<ModelHelper bind:showing={showingJoinModel}>
	<form name="?/join" method="post">
		<h2>Join an Organization</h2>
		<input placeholder="Join Code"/>
		<button>Join</button>
	</form>
</ModelHelper>





{#if data.user.orgUsers.length < 1}
	<div class="noOrgs">
		<h1>No Joined Organizations</h1>
		<p><button class="textButton" on:click={() => {showingJoinModel = true}}>Join</button> or <button on:click={() => {showingCreateModel = true}} class="textButton">Create</button> one!</p>
	</div>
	
{/if}


{#each data.user.orgUsers as orgUser}
	<a href="/org/{orgUser.organization.id}">{orgUser.organization.name}</a>
{/each}

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
		content: "";
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
		color: var(--bg);
	}
	form {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 50px;
		background: rgba(0, 0, 0, 0.25);
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
		color: var(--textLight);
		margin-bottom: 15px;
	}
	input::active {
		border: 1px solid var(--accent);
	}
	button {
		font-size: 1.2rem;
		width: 100%;
		padding: 10px;
		border-radius: 5px;
		border: 1px solid var(--accent);
		outline: 0px;
		background: var(--accent50);
		color: var(--textLight)
	}
</style>