<script lang="ts">

	export let content: string | null = "<h1>wow! what a club</h1>"
	export let editable: boolean = false;

	import { onMount, onDestroy } from 'svelte'
	import { Editor } from '@tiptap/core'
	import StarterKit from '@tiptap/starter-kit'

  
	let element: HTMLDivElement
	let editor: Editor
  
	onMount(() => {
	  editor = new Editor({
		element: element,
		editable,
		extensions: [
			StarterKit,
		],
		content: content,
		onTransaction: () => {
		  // force re-render so `editor.isActive` works as expected
		  editor = editor
		},
	  })
	})
  
	onDestroy(() => {
	  if (editor) {
		editor.destroy()
	  }
	})
  </script>
  
  <div bind:this={element} class="editor" />
  
  <style>
	button.active {
	  background: black;
	  color: white;
	}
	.editor {
		width: 100%;
		height: 100%;
	}
  </style>