<script lang="ts">
	import { Editor } from '@tiptap/core';
	export let editor: Editor | null;

	export let element: HTMLDivElement
	
</script>

<div class="menu" bind:this={element}>
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