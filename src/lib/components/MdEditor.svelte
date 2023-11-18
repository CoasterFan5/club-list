<script lang="ts">

	export let content: string | null = "<h1>wow! what a club</h1>"
	export let editable: boolean = false;
	let storedEditable = editable;

	import { onMount, onDestroy } from 'svelte'
	import { Editor } from '@tiptap/core'
	import StarterKit from '@tiptap/starter-kit'

	$: if(editable) {
		if(storedEditable == false) {
			console.log('woo')
			editor.setOptions({editable: true})
			editor.commands.focus()
			storedEditable = true
		}
	} else {
		storedEditable = false
	}
  
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
		onUpdate: () => {
			console.log("update")
			content = editor.getHTML()
		}
	  })

	  
	})

	
  
	onDestroy(() => {
	  if (editor) {
		editor.destroy()
	  }
	})
  </script>
  
  <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
  <div bind:this={element} class="editor"  />
  
  <style>
	.editor {
		width: 100%;
		height: 100%;
	}
  </style>