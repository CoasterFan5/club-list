<script lang="ts">
	import { enhance } from '$app/forms';
	import { pushState } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$lib/components/Button.svelte';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import Input from '$lib/components/Input.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import { handleForm } from '$lib/utils/formToaster.js';

	export let data;
	export let form;

	let name = data.club.name || '';
	let imgURL = data.club.imageURL || '';

	let confirmInput = '';

	$: handleForm(form, 'Club Updated!');

	let fileInputBox: HTMLInputElement;
	let fileUploadSubmit: HTMLButtonElement;
	const openFileUpload = () => {
		fileInputBox.click()
	}

	const submitNewImage = () => {
		fileUploadSubmit.click()
	}
</script>

{#if $page.state.showingModal == 'deleteClub'}
	<Modal on:close={() => history.back()}>
		<h2>Delete Club?</h2>
		<p>This will remove all club members and roles</p>
		<p>Type <strong>{data.club.name}</strong> to confirm</p>

		<Input bg="var(--bgPure)" label="Club Name" bind:value={confirmInput} />
		<hr />
		<form action="?/deleteClub" method="post" use:enhance>
			<Button disabled={confirmInput != data.club.name} value="Delete Club" />
		</form>
	</Modal>
{/if}

<div class="wrap">
	<div class="inner">

	


	<form hidden method="post" action="?/uploadClubImage" enctype="multipart/form-data" use:enhance>
		<input type="file" accept="image/*" name="file" bind:this={fileInputBox} on:change={submitNewImage}/>
		<button bind:this={fileUploadSubmit}/>
	</form>

	<form
		class="displayWrap"
		action="?/updateClub"
		method="post"
		use:enhance={() =>
			async ({ update }) => {
				await update({ reset: false });
			}}
	>
			
		<h2>General Settings</h2>
		<div class="formItem">
			<Input name="clubName" bg="white" label="Club Name" value={name} />
		</div>
		
		<div class="formItem">
			<Checkbox name="joinable" checked={data.club.openToJoin} label="Allow Joining" />
		</div>

		<div class="formItem">
			<Button type="submit" value="Save" />
		</div>

	</form>

	<div class="displayWrap">
		<h2>Club Image</h2>
		<div class="formItem">
			<div class="fileUpload">
				 <img src="{data.club.imageURL}" alt="club"/>
				 <button class="cover" type="button" on:click={openFileUpload}>
					<svg width="50%" height="50%" viewBox="0 0 24 24" style="fill: rgba(255, 255, 255, 1);"><path d="M11 15h2V9h3l-4-5-4 5h3z"></path><path d="M20 18H4v-7H2v7c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2v-7h-2v7z"></path></svg>
				 </button>
			</div>
		</div>
	</div>

	<div class="displayWrap">
		<h2>Danger Zone</h2>
		<div class="formItem">
			<Button
				value="Delete Club"
				on:click={() => {
					pushState('', {
						showingModal: 'deleteClub'
					});
				}}
			/>
		</div>
	</div>
</div>
</div>

<style lang="scss">
	.wrap {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.inner {
		width: 90%;
		height: 100%;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
	}
	.formItem {
		width: 100%;
		margin: 7px 0px;
		display: flex;
	}

	.fileUpload {
		border: 1px solid gray;
		width: 100%;
		border-radius: 5px;
		overflow: hidden;
		position: relative;
		aspect-ratio: 5/2;
		
		img {
			height: 100%;
			width: 100%;
			object-fit: cover;
		}

		.cover {
			all: unset;
			position: absolute;
			z-index: 1;
			top: 0px;
			left: 0px;
			height: 100%;
			width: 100%;
			background: rgba(0, 0, 0, 0.5);
			display: flex;
			align-items: center;
			justify-content: center;
			cursor: pointer;
			transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.5s;
		}

		.cover:hover {
			background: rgba(0, 0, 0, 0.75);
			backdrop-filter: blur(3px);
		}
	}

	.displayWrap {
		padding: 50px;
		background: var(--bgPure);
		box-sizing: border-box;
		min-width: 400px;
		max-width: 500px;
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		margin: 25px;
		justify-content: start;
		border-radius: 5px;
		box-shadow: 1px 1px 3px 3px rgba(0, 0, 0, 0.1);

		h2 {
			margin: 5px;
		}
	}
	hr {
		border: 0px;
	}
</style>
