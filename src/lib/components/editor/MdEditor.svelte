<script lang="ts">
	import { Editor } from '@tiptap/core';
	import BubbleMenu from '@tiptap/extension-bubble-menu';
	import { Color } from '@tiptap/extension-color';
	import FloatingMenu from '@tiptap/extension-floating-menu';
	import Link from '@tiptap/extension-link';
	import Placeholder from '@tiptap/extension-placeholder';
	import TextStyle from '@tiptap/extension-text-style';
	import Typography from '@tiptap/extension-typography';
	import StarterKit from '@tiptap/starter-kit';
	import Image from "@tiptap/extension-image"
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';

	import SaveIcon from '~icons/bx/save';

	import BubbleMenuElement from './BubbleMenuElement.svelte';
	import FloatingMenuElement from './FloatingMenuElement.svelte';

	export let content: string | null = '<h1>wow! what a club</h1>';
	export let editable: boolean;
	export let saveable = true;
	export let enableImages = false;

	let element: HTMLDivElement;
	let floatingMenu: HTMLDivElement;
	let bubbleMenu: HTMLDivElement;
	let editor: Editor | null;

	let saved = true;
	let isActive = false;

	const save = () => {
		if (!saved) {
			dispatch('saveRequest');
		}
	};

	onMount(() => {
		editor = new Editor({
			element,
			editable,
			extensions: [
				StarterKit,
				Typography,
				Color,
				Image.configure({
					HTMLAttributes: {
						class: "tipTapImage"
					}
				}),
				TextStyle,
				Link.configure({
					openOnClick: false,
					HTMLAttributes: {
						class: 'tipTapLink'
					}
				}),
				Placeholder.configure({
					showOnlyWhenEditable: true,
					includeChildren: true,
					placeholder: ({ node }) => {
						if (node.type.name === 'heading') {
							return 'Write something big...';
						}

						return 'Write something...';
					}
				}),
				FloatingMenu.configure({
					element: floatingMenu,
					tippyOptions: {
						offset: [0, -50]
					}
				}),
				BubbleMenu.configure({ element: bubbleMenu })
			],
			content: content,
			onTransaction: () => {
				// Force re-render so `editor.isActive` works as expected
				editor = editor;
			},
			onUpdate() {
				if (editor) content = editor.getHTML();
				saved = false;
			},
			onFocus: () => {
				isActive = true;
				dispatch('focus');
			},
			onBlur: () => {
				isActive = false;
				dispatch('blur');
			}
		});
	});

	const dispatch = createEventDispatcher<{
		saveRequest: undefined;
		focus: undefined;
		blur: undefined;
	}>();

	$: if (editor) editor.setEditable(editable);
	$: if (editable) focusEditor();
	const focusEditor = () => editor?.commands.focus();

	onDestroy(() => {
		if (editor) {
			editor.destroy();
		}
	});
</script>

<div class="wrap">
	<div bind:this={element} class="editor" class:borders={editable} class:focus={isActive} />
	<div class="utils">
		{#if saveable && !saved}
			<button on:click={save}>
				<SaveIcon height="30px" width="30px" />
			</button>
		{/if}
	</div>
</div>

<FloatingMenuElement {enableImages} bind:editor bind:element={floatingMenu} />
<BubbleMenuElement bind:editor bind:element={bubbleMenu} />

<style lang="scss">
	.editor {
		width: 100%;
		height: 100%;
		padding: 0.5rem;
		box-sizing: border-box;
		border-radius: 5px;
	}

	.borders {
		border: 1px solid gray;

		&.focus {
			border: 1px solid var(--accent);
		}
	}

	.wrap :global(.tiptap .is-empty::before) {
		color: #adb5bd;
		content: attr(data-placeholder);
		float: left;
		height: 0;
		pointer-events: none;
	}

	.utils {
		position: absolute;
		border-radius: 5px;
		top: 0px;
		right: 0px;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		margin: 1px;
		background: var(--bgPure);
	}

	.utils button {
		all: unset;
		cursor: pointer;
		aspect-ratio: 1/1;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 5px;

		&:hover {
			background: var(--accent50);
		}
	}
</style>
