<script lang="ts">
	import Button from '$lib/components/Button.svelte';
import Input from '$lib/components/Input.svelte';
import ModelHelper from '$lib/modules/ModelHelper.svelte';
import type { PageData } from './$types';
	export let data: PageData;

	let visibileModel = false;

	let showModel = () => {
		visibileModel = true;
	}
</script>

<ModelHelper bind:showing={visibileModel}>
	<form class="settingsForm" method="post" action="?/updateClub">
		<h2>Settings</h2>
		<div class="formItem">
			<Input name="clubName" label="Club Name" value={data.club.name}/>
		</div>
		<div class="formItem">
			<Input name="imgURL" label="Image URL"/>
		</div>
		<div class="formItem">
			<Button value="Update"/>
		</div>
		
	</form>
</ModelHelper>

<div class="wrap">
	<div class="header">
		<h1 class="title">{data.club.name}</h1>
		<div class="toolbar">
			<button on:click={showModel}>
				<img src="/settings.svg" alt="settings">
			</button>
			
		</div>
	</div>	
</div>

<style>
	.wrap {
		height: 100%;
		width: 100%;
		box-sizing: border-box;
		padding: 1rem 5rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: start;
	}
	.header {
		position: relative;
		width: 100%;
		aspect-ratio: 3/1;
		border-radius: 15px;
		overflow: hidden;
		

	}
	
	.title {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 3rem;
		margin: 0px;
		background: rgba(255, 255, 255, 0.75);
		font-weight: 400;
	}
	.toolbar {
		position: absolute;
		bottom: 0px;
		right: 0px;
		padding: 7px;
	}
	.toolbar button {
		all: unset;
		transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.5s;
		border-radius: 100%;
		cursor: pointer;
	}
	.toolbar img {
		max-width: 36px;
	}
	.toolbar button:hover {
		rotate: 30deg;
	}
	.settingsForm {
		background: var(--bgPure);
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		padding: 20px;
		border-radius: 5px;
	}
	.formItem {
		margin: 7px 0px;
		width: 100%;
	}
</style>
