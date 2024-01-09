<script lang="ts">
	import { onMount, onDestroy, createEventDispatcher } from 'svelte';

	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import Typography from '@tiptap/extension-typography';
	import { Color } from '@tiptap/extension-color';
	import TextStyle from '@tiptap/extension-text-style';
	import BubbleMenu from '@tiptap/extension-bubble-menu';
	import FloatingMenu from '@tiptap/extension-floating-menu';
	import FloatingMenuElement from './FloatingMenuElement.svelte';
	import BubbleMenuElement from './BubbleMenuElement.svelte';

	export let content: string | null = '<h1>wow! what a club</h1>';
	export let editable: boolean;
	export let saveable = true;

	let element: HTMLDivElement;
	let floatingMenu: HTMLDivElement;
	let bubbleMenu: HTMLDivElement;
	let editor: Editor | null;

	let saved = true;

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
				TextStyle,
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
				// force re-render so `editor.isActive` works as expected
				editor = editor;
			},
			onUpdate() {
				if (editor) content = editor.getHTML();
				saved = false;
			},
			onFocus: () => dispatch('focus'),
			onBlur: () => dispatch('blur')
		});
	});

	const dispatch = createEventDispatcher();

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
	<div bind:this={element} class="editor" class:borders={editable} />
	<div class="utils">
		{#if saveable && !saved}
			<button on:click={save}>
				<img alt="save" src="/icons/save.svg" />
			</button>
		{/if}
	</div>
</div>

<FloatingMenuElement bind:editor bind:element={floatingMenu} />
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

	.utils img {
		height: 30px;
	}

	.menu {
		border-radius: 5px;
		overflow: hidden;
		background: var(--bgPure);
		display: flex;

		button {
			all: unset;
			cursor: pointer;
			padding: 10px;
			background: white;

			&:hover {
				background: var(--accent50);
			}

			.active {
				background: black;
				color: white;
			}
		}
	}
</style>
