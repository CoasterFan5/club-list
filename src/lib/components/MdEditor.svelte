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
	$: if (editor && editable) editor.commands.focus();

	onDestroy(() => {
		if (editor) {
			editor.destroy();
		}
	});
</script>

<div bind:this={element} class="editor" />

<div bind:this={floatingMenu} class="menu">
	<button
		on:click={() => editor && editor.chain().focus().toggleHeading({ level: 1 }).run()}
		class:active={editor?.isActive('heading', { level: 1 })}
	>
		h1
	</button>
	<button
		on:click={() => editor && editor.chain().focus().toggleHeading({ level: 2 }).run()}
		class:active={editor?.isActive('heading', { level: 2 })}
	>
		h2
	</button>
	<button
		on:click={() => editor && editor.chain().focus().toggleBulletList().run()}
		class:active={editor?.isActive('bulletList')}
	>
		ul
	</button>
</div>

<div bind:this={bubbleMenu} class="menu">
	<button
		on:click={() => editor && editor.chain().focus().toggleBold().run()}
		class:active={editor?.isActive('bold')}
	>
		bold
	</button>
	<button
		on:click={() => editor && editor.chain().focus().toggleItalic().run()}
		class:active={editor?.isActive('italic')}
	>
		italic
	</button>
	<button
		on:click={() => editor && editor.chain().focus().toggleStrike().run()}
		class:active={editor?.isActive('strike')}
	>
		strike
	</button>
	<button
		on:click={() => editor && editor.chain().focus().toggleCode().run()}
		class:active={editor?.isActive('code')}
	>
		code
	</button>
</div>

<style>
	.editor {
		width: 100%;
		height: 100%;
		border: 1px solid black;
		padding: 1rem;
		border-radius: 5px;
		margin-top: 1rem;
	}

	.menu button {
		all: unset;
		cursor: pointer;
		padding: 0.25rem 0.5rem;
		border-radius: 5px;
		background: white;
		border: 1px solid black;
	}

	.menu button.active {
		background: black;
		color: white;
	}
</style>
