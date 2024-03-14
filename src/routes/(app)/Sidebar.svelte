<script lang="ts">
	import type { LayoutData } from './$types';
	export let data: LayoutData;

	import HomeIcon from '~icons/bxs/home';
	import CalIcon from '~icons/bx/Calendar-alt';
	import OrgIcon from '~icons/bx/building';
	import SmileIcon from '~icons/bx/smile';
	import Modal from '$lib/components/Modal.svelte';
	import { pushState } from '$app/navigation';
	import { page } from '$app/stores';
	import SmileScale from './SmileScale.svelte';
	import Button from '$lib/components/Button.svelte';

	const openReport = () => {
		pushState('', {
			showingModal: 'feedback'
		});
	};
</script>

{#if $page.state.showingModal == 'feedback'}
	<Modal
		on:close={() => {
			history.back();
		}}
	>
		<form class="feedback">
			<h2>Feedback</h2>
			<h3>Hows it going?</h3>
			<SmileScale />

			<h3>Whats going on?</h3>
			<textarea class="feedbackText" name="issueDesc" placeholder="Description"/>
			<hr/>
			<Button value="Submit"/>
		
		</form>
	</Modal>
		
{/if}

<nav class="sidebar">
	<a class="pfp" href="/profile">
		<img class="pfpImage" alt="profile" src={data.user?.pfp || '/defaultPFP.png'} />
	</a>
	<a class="button" href="/dashboard">
		<HomeIcon height="100%" width="100%" />
	</a>
	<a class="button" href="/calendar">
		<CalIcon height="100%" width="100%" />
	</a>
	<a class="button" href="/org">
		<OrgIcon height="100%" width="100%" />
	</a>
	<button class="button" on:click={openReport}>
		<SmileIcon height="100%" width="100%" />
	</button>
</nav>

<style lang="scss">
	.sidebar {
		width: 75px;
		padding: 12px;
		box-sizing: border-box;
		background: var(--bgPure);
		height: 100vh;
		box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.1);
		z-index: 1000;
	}
	.pfp {
		display: flex;
		width: 100%;
		aspect-ratio: 1/1;
		border-radius: 5px;
		position: relative;
		overflow: hidden;

		&::after {
			content: '';
			position: absolute;
			width: 100%;
			height: 100%;
			top: 0px;
			left: 0px;
			background: var(--bgPure);
		}
	}
	.pfpImage {
		width: 100%;
		aspect-ratio: 1/1;
		resize: vertical;
		z-index: 3;
		border: 2px solid var(--accent);
		border-radius: 5px;
		opacity: 1;
		overflow: hidden;
		object-fit: cover;
	}

	.button {
		all: unset;
		display: flex;
		width: 100%;
		padding: 10px;
		box-sizing: border-box;
		margin: 5px 0px;
		aspect-ratio: 1/1;
		transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.5s;
		border-radius: 5px;
		cursor: pointer;
		filter: var(--redIconFilter);

		&:hover {
			background: rgba(0, 0, 0, 0.5);
			border-radius: 5px;
		}

		img {
			aspect-ratio: 1/1;
			width: 100%;
			height: 100%;
		}
	}

	.feedbackText {
		width: 100%;
		resize: vertical;
		padding: 5px;
		box-sizing: border-box;
		border: 1px solid gray;
		border-radius: 3px;
		margin: 0px;
		outline: 0px solid transparent;
		font-family:
			Work Sans,
			sans-serif;
		
		&:focus,
		&:active {
			outline: 0px;
			border: 1px solid var(--accent);
		}

	}

	hr {
		border: 0px;
	}

	.feedback {
		min-width: 350px;
		h3 {
			font-weight: 500;
		}
	}
</style>
