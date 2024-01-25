<script lang="ts">
	import { get } from 'svelte/store';

	import { page } from '$app/stores';
	import Button from '$lib/components/Button.svelte';
	import Link from '$lib/components/Link.svelte';

	export let data;

	let route = get(page).route;
	page.subscribe((page) => (route = page.route));

	let baseURL = `/org/${data.org.id}/club/${data.club.id.toString()}`;
</script>

<div class="wrap">
	<div class="header">
		<div class="headerInner">
			<div class="title">
				<a class="back" href="/org/{data.org.id}">
					<img alt="back" src="/icons/back.svg" />
				</a>

				<h2 class="clubName">{data.club.name}</h2>

				{#if !data.clubUser && data.club.ownerId != data.user?.id && data.club.openToJoin}
					{#if data.user}
						<form class="buttonWrap" action="{baseURL}?/joinClub" method="post">
							<Button value="Join Club" />
						</form>
					{:else}
						<a class="buttonWrap" href="/login">
							<Button value="Login to join" />
						</a>
					{/if}
				{/if}
			</div>
			<div class="nav">
				<div class="link" class:selected={route.id == '/(app)/org/[id]/club/[clubId]'}>
					<Link
						--fontSize="1.1rem"
						--marginRight="20px"
						--padding="5px 0px"
						href={baseURL}
						textColor="black">Home</Link
					>
				</div>
				{#if data.user || !data.org.hideSensitive}
					<div
						class="link"
						class:selected={route.id == '/(app)/org/[id]/club/[clubId]/announcements'}
					>
						<Link
							--fontSize="1.1rem"
							--marginRight="20px"
							--padding="5px 0px"
							href="{baseURL}/announcements"
							textColor="black">Announcements</Link
						>
					</div>
					<div class="link" class:selected={route.id == '/(app)/org/[id]/club/[clubId]/events'}>
						<Link
							--fontSize="1.1rem"
							--marginRight="20px"
							--padding="5px 0px"
							href="{baseURL}/events"
							textColor="black">Events</Link
						>
					</div>
					{#if data.clubPerms.admin || data.clubPerms.updateAppearance}
						<div class="link" class:selected={route.id == '/(app)/org/[id]/club/[clubId]/settings'}>
							<Link
								--fontSize="1.1rem"
								--marginRight="20px"
								--padding="5px 0px"
								href="{baseURL}/settings"
								textColor="black">Settings</Link
							>
						</div>
					{/if}
				{/if}
			</div>
		</div>
	</div>
	<div class="inner">
		<slot />
	</div>
</div>

<style lang="scss">
	.wrap {
		width: 100%;
		height: 100%;
		min-height: 100vh;
		display: flex;
		align-items: center;
		flex-direction: column;
		padding-bottom: 50px;
		box-sizing: border-box;
	}
	.header {
		background: var(--bgMid);
		width: 100%;
		padding-top: 25px;
		box-sizing: border-box;
		box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.1);
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.headerInner {
		width: 90%;
	}
	.title {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: start;
		margin-bottom: 25px;
	}

	.inner {
		display: flex;
		width: 100%;
		height: 100%;
		flex-direction: column;
		align-items: center;
		justify-content: start;
	}

	.clubName {
		font-size: 2rem;
		font-weight: 500;
		margin: 0px;
		padding-left: 10px;
	}

	.nav {
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: start;
		align-items: start;
		overflow-x: auto;
		scrollbar-width: none;

		::-webkit-scrollbar {
			display: none;
		}

		.link {
			padding: 5px 5px;
			box-sizing: border-box;

			width: max-content;

			:global(a:hover) {
				color: var(--accent) !important;
			}

			&.selected {
				color: var(--accent50);
			}
		}
	}
	.back {
		all: unset;
		cursor: pointer;
		height: 100%;
		text-align: center;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.5s;
	}
	.back:hover {
		scale: 1.1;
		transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.5s;
	}
	.buttonWrap {
		text-decoration: none;
		padding: 0px 10px;
	}
</style>
