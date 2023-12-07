<script lang="ts">
	import { onMount, onDestroy, createEventDispatcher } from 'svelte';

	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import Typography from '@tiptap/extension-typography';
	import { Color } from '@tiptap/extension-color';
	import TextStyle from '@tiptap/extension-text-style';
	import BubbleMenu from '@tiptap/extension-bubble-menu';
	import FloatingMenu from '@tiptap/extension-floating-menu';

	export let content: string | null = '<h1>wow! what a club</h1>';
	export let editable: boolean;

	let element: HTMLDivElement;
	let floatingMenu: HTMLDivElement;
	let bubbleMenu: HTMLDivElement;
	let editor: Editor | null;

	onMount(() => {
		editor = new Editor({
			element,
			editable,
			extensions: [
				StarterKit,
				Typography,
				Color,
				TextStyle,
				FloatingMenu.configure({ element: floatingMenu }),
				BubbleMenu.configure({ element: bubbleMenu })
			],
			content: content,
			onTransaction: () => {
				// force re-render so `editor.isActive` works as expected
				editor = editor;
			},
			onUpdate() {
				if (editor) content = editor.getHTML();
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

<div bind:this={element} class="editor" />

<div bind:this={floatingMenu} class="menu">
	<button
		class:active={editor?.isActive('heading', { level: 1 })}
		on:click={() => editor && editor.chain().focus().toggleHeading({ level: 1 }).run()}
	>
		h1
	</button>
	<button
		class:active={editor?.isActive('heading', { level: 2 })}
		on:click={() => editor && editor.chain().focus().toggleHeading({ level: 2 }).run()}
	>
		h2
	</button>
	<button
		class:active={editor?.isActive('bulletList')}
		on:click={() => editor && editor.chain().focus().toggleBulletList().run()}
	>
		ul
	</button>
</div>

<div bind:this={bubbleMenu} class="menu">
	<button
		class:active={editor?.isActive('bold')}
		on:click={() => editor && editor.chain().focus().toggleBold().run()}
	>
		bold
	</button>
	<button
		class:active={editor?.isActive('italic')}
		on:click={() => editor && editor.chain().focus().toggleItalic().run()}
	>
		italic
	</button>
	<button
		class:active={editor?.isActive('strike')}
		on:click={() => editor && editor.chain().focus().toggleStrike().run()}
	>
		strike
	</button>
	<button
		class:active={editor?.isActive('code')}
		on:click={() => editor && editor.chain().focus().toggleCode().run()}
	>
		code
	</button>
</div>

<style lang="scss">
	.editor {
		width: 100%;
		height: 100%;
		border: 1px solid gray;
		padding: 1rem;
		box-sizing: border-box;
		border-radius: 5px;
		margin-top: 1rem;
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
