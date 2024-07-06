<script lang="ts">
	import { Editor } from '@tiptap/core';
	export let editor: Editor | null;

	import BoldIcon from '~icons/bx/bold';
	import CodeIcon from '~icons/bx/code-curly';
	import ItalicIcon from '~icons/bx/italic';
	import LinkIcon from '~icons/bx/link';
	import StrikeIcon from '~icons/bx/strikethrough';
	import UnlinkIcon from '~icons/bx/unlink';
	import Heading1 from '~icons/lucide/heading-1';
	import Heading2 from '~icons/lucide/heading-2';

	import Button from '../Button.svelte';
	import Input from '../Input.svelte';
	import Modal from '../Modal.svelte';

	export let element: HTMLDivElement;

	let linkHref: string = '';
	let settingLink = false;

	const editorSetLink = (e: Event) => {
		e.preventDefault();
		editor && editor.chain().focus().toggleLink({ href: linkHref, class: 'tipTapLink' }).run();
		settingLink = false;
	};
</script>

{#if settingLink}
	<Modal
		on:close={() => {
			settingLink = false;
		}}
	>
		<form class="linkForm" on:submit={editorSetLink}>
			<h2>Link Destination</h2>
			<Input bg="var(--bgPure)" label="https://clubsaur.us" bind:value={linkHref} />
			<br />
			<Button type="submit" value="Apply" />
		</form>
	</Modal>
{/if}

<div bind:this={element} class="menu">
	<button
		class:active={editor?.isActive('bold')}
		on:click={() => editor && editor.chain().focus().toggleBold().run()}
	>
		<BoldIcon />
	</button>
	<button
		class:active={editor?.isActive('italic')}
		on:click={() => editor && editor.chain().focus().toggleItalic().run()}
	>
		<ItalicIcon />
	</button>
	<button
		class:active={editor?.isActive('strike')}
		on:click={() => editor && editor.chain().focus().toggleStrike().run()}
	>
		<StrikeIcon />
	</button>
	<button
		class:active={editor?.isActive('code')}
		on:click={() => editor && editor.chain().focus().toggleCode().run()}
	>
		<CodeIcon />
	</button>
	<button on:click={() => (settingLink = true)}>
		<LinkIcon />
	</button>
	<button on:click={() => editor && editor.chain().focus().unsetLink().run()}>
		<UnlinkIcon />
	</button>
	<span>
		<hr />
	</span>
	<button
		class:active={editor?.isActive('heading', { level: 1 })}
		on:click={() => editor && editor.chain().focus().toggleHeading({ level: 1 }).run()}
	>
		<Heading1 />
	</button>
	<button
		class:active={editor?.isActive('heading', { level: 2 })}
		on:click={() => editor && editor.chain().focus().toggleHeading({ level: 2 }).run()}
	>
		<Heading2 />
	</button>
</div>

<style lang="scss">
	.menu {
		border-radius: 5px;
		overflow: hidden;
		background: var(--mid);
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: start;

		span {
			height: 100%;
			background: white;
			width: 1px;
			padding: 0.25rem 0;
			opacity: 0.5;
			margin: 0px;
			height: 100%;
			box-sizing: unset;

			hr {
				height: 100%;
				background: var(--accent);
				color: var(--accent);
				border: 0px;
			}
		}

		button {
			all: unset;
			cursor: pointer;
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 0.75rem 0.5rem;
			background: var(--mid);
			color: var(--text);

			&.active {
				background: var(--dark);
				color: var(--accent);
			}
		}
	}

	br {
		background: transparent;
	}
	.linkBox {
		position: fixed;
	}

	.linkForm {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
</style>
