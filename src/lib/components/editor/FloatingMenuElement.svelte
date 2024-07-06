<script lang="ts">
	import { Editor } from '@tiptap/core';
	import { fade } from 'svelte/transition';

	import CodeIcon from '~icons/ph/brackets-curly-thin';
	import ImageIcon from '~icons/ph/image-thin';
	import BulletsIcon from '~icons/ph/list-bullets-thin';
	import PlusIcon from '~icons/ph/plus-thin';
	import LineBreak from '~icons/ph/split-vertical-thin';
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import Modal from '$lib/components/Modal.svelte';

	export let editor: Editor | null;
	export let element: HTMLDivElement;

	let settingImage = false;
	let showSubMenu = false;
	export let enableImages = false;

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

	let imageURL = '';
	let imageALT = '';
	const editorSetImage = () => {
		editor &&
			editor
				.chain()
				.focus()
				.setImage({
					src: imageURL,
					alt: imageALT
				})
				.run();
		settingImage = false;
		closeMenu();
	};
</script>

{#if settingImage}
	<Modal
		on:close={() => {
			settingImage = false;
		}}
	>
		<form class="imageForm" on:submit={editorSetImage}>
			<h2>Link Destination</h2>
			<Input bg="var(--bgPure)" label="Image URL" bind:value={imageURL} />
			<br />
			<Input bg="var(--bgPure)" label="Image ALT" bind:value={imageALT} />
			<br />
			<Button type="submit" value="Apply" />
		</form>
	</Modal>
{/if}

<div bind:this={element} class="wrap" on:blur={closeMenu} transition:fade={{ duration: 500 }}>
	<button class="plusButton" class:active={showSubMenu} on:click={clickHelper}>
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
					<button on:click={button.function}>
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
	}
</style>
