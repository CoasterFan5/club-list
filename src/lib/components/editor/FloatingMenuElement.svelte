<script lang="ts">
	import { Editor } from '@tiptap/core';
	import { fade } from 'svelte/transition';

	import ImageAddIcon from '~icons/bx/image-add';
	import CodeIcon from '~icons/ph/brackets-curly-thin';
	import ImageIcon from '~icons/ph/image-thin';
	import BulletsIcon from '~icons/ph/list-bullets-thin';
	import PlusIcon from '~icons/ph/plus-thin';
	import LineBreak from '~icons/ph/split-vertical-thin';
	import Button from '$lib/components/Button.svelte';
	import Modal from '$lib/components/Modal.svelte';

	import LoadingSpinner from '../LoadingSpinner.svelte';
	import { addToast } from '../toaster';

	export let editor: Editor | null;
	export let element: HTMLDivElement;

	let settingImage = false;
	let showSubMenu = false;

	const clickHelper = () => (showSubMenu = !showSubMenu);
	const closeMenu = () => (showSubMenu = false);

	const buttons = [
		{
			icon: BulletsIcon,
			function: () => {
				editor && editor.chain().focus().toggleBulletList().run();
				closeMenu();
			}
		},
		{
			icon: LineBreak,
			function: () => {
				editor && editor.chain().focus().setHardBreak().run();
				closeMenu();
			}
		},
		{
			icon: CodeIcon,
			function: () => {
				editor && editor.chain().focus().setCodeBlock().run();
				closeMenu();
			}
		},
		{
			icon: ImageIcon,
			function: () => {
				settingImage = true;
			}
		}
	];

	let fileInput: HTMLInputElement;
	let fileInputButton: HTMLButtonElement;
	let files: FileList;
	let uploadingImage = false;

	const setButtonBackground = () => {
		let reader = new FileReader();
		reader.onloadend = () => {
			fileInputButton.style.backgroundImage = `url(${reader.result})`;
			fileInputButton.innerHTML = '';
		};
		if (fileInput.files && fileInput.files[0]) {
			reader.readAsDataURL(fileInput.files[0]);
		}
	};

	const editorSetImage = async () => {
		const formData = new FormData();
		if (!files || !files[0]) {
			addToast({
				type: 'error',
				message: 'Please specify file'
			});
		}
		formData.append('file', files[0]);
		uploadingImage = true;
		const req = await fetch('/api/image/upload', {
			method: 'post',
			body: formData
		});

		if (req.status != 200) {
			try {
				const response = await req.json();
				addToast({
					type: 'error',
					message: response.message
				});
			} catch (e) {
				addToast({
					type: 'error',
					message: 'Failed to upload image'
				});
			}
			uploadingImage = false;
			settingImage = false;
		} else {
			try {
				const response = await req.json();
				const imageUrl = response.imageUrl;
				editor &&
					editor
						.chain()
						.focus()
						.setImage({
							src: imageUrl
						})
						.run();
				addToast({
					type: 'success',
					message: 'Image Uploaded'
				});
				uploadingImage = false;
				settingImage = false;
			} catch (e) {
				addToast({
					type: 'error',
					message: 'Could not process uploaded image. Please contact support for help.'
				});
				uploadingImage = false;
				settingImage = false;
			}
		}
	};
</script>

{#if settingImage}
	<Modal
		on:close={() => {
			settingImage = false;
		}}
	>
		<!-- svelte-ignore a11y-no-static-element-interactions -->

		<div
			class="imageForm"
			on:keydown={(e) => {
				if (e.key == 'Enter') {
					e.preventDefault();
					editorSetImage();
				}
			}}
		>
			{#if uploadingImage}
				<div class="loadingSpinnerHolder">
					<LoadingSpinner radius={20} strokeWidth="5px" />
				</div>
			{/if}
			<h2>Upload Image</h2>
			<input
				bind:this={fileInput}
				accept="image/*"
				hidden
				type="file"
				on:input={setButtonBackground}
				bind:files
			/>
			<button
				bind:this={fileInputButton}
				class="imageUpload"
				type="button"
				on:click={() => {
					fileInput.click();
				}}
			>
				<ImageAddIcon />
			</button>
			<Button type="button" value="Upload" on:click={editorSetImage} />
		</div>
	</Modal>
{/if}

<div bind:this={element} class="wrap" on:blur={closeMenu} transition:fade={{ duration: 500 }}>
	<button class="plusButton" class:active={showSubMenu} type="button" on:click={clickHelper}>
		<PlusIcon />
	</button>

	<div class="secondMenu">
		{#each buttons as button, i}
			{#if showSubMenu}
				<div
					style="transform: rotate({-90 +
						(180 / (buttons.length - 1)) * i}deg) translate(3rem) rotate({90 -
						(180 / (buttons.length - 1)) * i}deg)"
					class="buttonWrap"
					transition:fade={{
						duration: 50,
						delay: 30 * i
					}}
				>
					<button type="button" on:click={button.function}>
						<svelte:component this={button.icon} />
					</button>
				</div>
			{/if}
		{/each}
	</div>
</div>

<style lang="scss">
	.plusButton {
		all: unset;
		cursor: pointer;
		aspect-ratio: 1/1;
		font-size: 1.2rem;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.25rem;
		border-radius: 50%;
		outline: 1px solid var(--textDark);
		transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.5s;

		&.active {
			transform: rotate(45deg);
		}
	}
	.wrap {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}
	.secondMenu {
		.buttonWrap {
			position: absolute;
			bottom: 0px;
			left: 0px;
		}
		button {
			all: unset;
			cursor: pointer;
			aspect-ratio: 1/1;
			display: flex;
			font-size: 1.2rem;
			align-items: center;
			justify-content: center;
			padding: 0.25rem;
			outline: 1px solid var(--textDark);
			border-radius: 50%;
			backdrop-filter: blur(1px);
			background: rgba(255, 255, 255, 0.5);
			transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.25s;

			&:hover {
				transform: rotate(15deg);
			}
		}
	}

	.imageForm {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: relative;
	}

	.imageUpload {
		all: unset;
		background: var(--text);
		width: 100%;
		cursor: pointer;
		margin-bottom: 1rem;
		border-radius: 0.25rem;

		aspect-ratio: 3/2;
		min-width: 20rem;
		font-size: 3rem;
		background-size: cover;
		background-position: center;
	}

	.loadingSpinnerHolder {
		position: absolute;
		height: 100%;
		width: 100%;
		background-color: rgba(255, 255, 255, 0.3);
		backdrop-filter: blur(5px);
		padding: 20px;
		border-radius: 5px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
