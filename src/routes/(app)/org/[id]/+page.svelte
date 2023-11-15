<script lang="ts">
	import Button from '$lib/components/Button.svelte';
import Input from '$lib/components/Input.svelte';
import ModelHelper from '$lib/modules/ModelHelper.svelte';
	import type { PageData } from './$types';
	export let data: PageData;

	let showingModel = false;
	let toggleModel = () => {
		showingModel = !showingModel;
	}
</script>

<ModelHelper bind:showing={showingModel}>
	<form>
		<div class="formItem">
			<Input name="clubName" label="Club Name"/>
		</div>
		<div class="formItem">
			<Button type="submit" value="Create"/>
		</div>
		
		
	</form>
</ModelHelper>

<div class="wrap">
	<div class="clubs">
		{#if data.clubs.length < 1}
			<h2>No clubs here yet. {#if data.orgUser.role == "ADMIN" || data.orgUser.role == "OWNER"}<button class="textButton" on:click={toggleModel}>Create One?</button>{/if}</h2>
		{/if}
		{#each data.clubs as club}
			<a href="/club/{club.id}" class="club">
				<h2>{club.name}</h2>
			</a>
		{/each}
	</div>
	<div class="sidebar">
		<h2>Tags</h2>
	</div>
</div>

<style>
	.wrap {
		height: 100%;
		width: 100%;
		box-sizing: border-box;
		padding: 1rem 5rem;
		display: flex;
		flex-direction: row;
		align-items: start;
		justify-content: center;
	}
	.clubs {
		width: 100%;
		box-sizing: border-box;
		padding-right: 1rem;
		height: 100%;
		display: flex;
		align-items: start;
		justify-content: center;
	}
	.sidebar {
		width: 250px;
		border-radius: 5px;
		display: flex;
		align-items: center;
		flex-direction: column;
		background: #ffffff;
		box-shadow: 2px 2px rgba(0, 0, 0, 0.1);
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
	form {
		border-radius: 5px;
		padding: 20px;
		background: var(--bgPure);
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.formItem {
		width: 100%;
		margin: 7px;
	}
</style>
