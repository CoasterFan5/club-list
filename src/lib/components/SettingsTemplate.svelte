<script context="module" lang="ts">
	export type SettingsLinkTemplate = {
		title: string;
		links: {
			title: string;
			href: string;
		}[];
	}[];
</script>

<script lang="ts">
	import { quintInOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';

	import { page } from '$app/stores';
	export let pages: SettingsLinkTemplate;
	export let backLink = '';
</script>

<div class="wrap">
	<div class="sidebar">
		<div class="top">
			{#each pages as settingsPage}
				<h6>{settingsPage.title}</h6>
				{#each settingsPage.links as link}
					<a class:active={$page.url.pathname == link.href} href={link.href}>{link.title}</a>
				{/each}
				<hr />
			{/each}
		</div>
		<a href={backLink}>Done</a>
	</div>
	<div class="inner">
		<div class="content">
			{#key $page.url.pathname}
				<div
					class="contentInner"
					in:fade|global={{
						delay: 0,
						duration: 500,
						easing: quintInOut
					}}
				>
					<slot />
				</div>
			{/key}
		</div>
	</div>
</div>

<style lang="scss">
	.wrap {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: row;
	}

	.sidebar {
		background: var(--bgMid);
		height: 100%;
		box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.1);
		text-align: center;
		display: flex;
		border-radius: 3px;
		flex-direction: column;
		align-items: end;
		justify-content: start;
		min-width: 200px;
		width: 40%;
		padding: 50px 0px;
		box-sizing: border-box;
		position: relative;
		top: 0px;

		& a {
			all: unset;
			cursor: pointer;
			width: 150px;
			padding: 5px 10px;
			box-sizing: border-box;
			border-radius: 3px;
			margin-bottom: 2px;
			text-align: left;
			transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.5s;

			&:hover {
				background: var(--accent50);
			}

			&.active {
				background: var(--accent50);
				opacity: 0.5;
			}
		}
	}
	h6 {
		font-weight: 600;
		margin: 5px 0px;
		font-size: 0.8rem;
	}
	hr {
		all: unset;
		margin: 5px 0px;
		width: calc(100% - 10px);
		border-bottom: 1px solid rgba(0, 0, 0, 0.2);
		box-sizing: border-box;
	}

	.top {
		height: 100%;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: start;
	}

	.inner {
		width: 100%;
		height: 100%;
		min-width: 500px;
		padding: 50px;
		box-sizing: border-box;
		display: flex;
		flex-direction: row;
		align-items: center;
		overflow-y: auto;
	}

	.content {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: row;
		text-align: center;
		align-items: center;
		justify-content: center;
	}
	.contentInner {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: start;
		box-sizing: border-box;
	}
</style>
