<script lang="ts">
	import type { LayoutData } from './$types';

	export let data: LayoutData;

	import OrgIcon from '~icons/bx/building';
	import CalIcon from '~icons/bx/Calendar-alt';
	import SmileIcon from '~icons/bx/smile';
	import HomeIcon from '~icons/bxs/home';
	import { pushState } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$lib/components/Button.svelte';
	import Modal from '$lib/components/Modal.svelte';

	import SmileScale from './SmileScale.svelte';

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
		<form class="feedback" action="/feedback?/submitFeedback" method="post">
			<h2>Clubsaurus Feedback</h2>
			<h3>How are you liking Clubsaurus?</h3>
			<SmileScale name="generalRating" />
			<h3>How bug-free is Clubsaurus?</h3>
			<SmileScale name="bugRating" />
			<h3>How is the design of Clubsaurus?</h3>
			<SmileScale name="designRating" />

			<h3>Other comments/concerns/bugs?</h3>
			<textarea name="description" class="feedbackText" placeholder="Comments" />
			<hr />
			<Button value="Submit" />
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
	<a class="button" aria-label="Calendar" href="/calendar">
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
	}

	:global(svg) {
		filter: var(--redIconFilter);
		aspect-ratio: 1/1;
		width: 100%;
		height: 100%;
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
		min-height: 11rem;
		font-size: 1.1rem;
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
		padding: 0px 25px;
		h3 {
			font-weight: 500;
		}
	}
</style>
