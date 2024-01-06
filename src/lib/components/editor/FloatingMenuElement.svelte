<script lang="ts">
	import { Editor } from '@tiptap/core';
	export let editor: Editor | null;

	export let element: HTMLDivElement

	let button: HTMLButtonElement;
	let showSubMenu = false;

	let clicks = 0;

	const clickHelper = (e: Event) => {
		showSubMenu = true;
		
	}

	const closeMenu = (e?: Event) => {
		showSubMenu = false;
	}

	const enableTitle = () => {
		editor && editor.chain().focus().toggleHeading({ level: 1 }).run()
		closeMenu()
	}
	const enableSubTitle = () => {
		editor && editor.chain().focus().toggleHeading({ level: 2 }).run()
		closeMenu()
	}
	const enableList = () => {
		editor && editor.chain().focus().toggleBulletList().run()
		closeMenu()
	}

	

	
	/*let showing;
	$: showing = editor?.state.selection.$anchor.parent.isTextblock && !editor?.state.selection.$anchor.parent.textContent;*/
</script>


<div class="wrap" bind:this={element} on:blur={closeMenu}>
	<div class="menu">
		<button on:click={clickHelper} bind:this={button}  >
			<svg width="24" height="24" viewBox="0 0 24 24" style="fill: var(--textDark)">
				<path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4z"></path>
				<path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"></path>
			</svg>
		</button>
		
	</div>
	{#if showSubMenu}
		<div class="secondMenu">
			<button
				class:active={editor?.isActive('heading', { level: 1 })}
				on:click={enableTitle}
			>
				h1
			</button>
			<button
				class:active={editor?.isActive('heading', { level: 2 })}
				on:click={enableSubTitle}
			>
				h2
			</button>
			<button
				class:active={editor?.isActive('bulletList')}
				on:click={enableList}
			>
				ul
			</button>
		</div>
	{/if}
</div>



<style lang="scss">
	.menu {
		border-radius: 5px;
		overflow: hidden;
		display: flex;

		button {
			all: unset;
			cursor: pointer;
		}
	}
	.wrap {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}
	.secondMenu {
		margin-left: 25px;
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

			&.active {
				background: var(--accent);
				color: white;
			}
		}
	}

</style>