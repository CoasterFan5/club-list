<script lang="ts">
	import { page } from '$app/stores';
	import { get } from 'svelte/store';
	import type { PageData } from './$types';
	export let data: PageData;

	let route = get(page).route;
	page.subscribe((page) => {
		route = page.route;
	});

	console.log(route);

	let baseURL = `/org/${data.org.id}/club/${data.club.id.toString()}`;
</script>

<div class="wrap">
	<div class="header">
		<div class="headerInner">
			<div class="title">
				<a class="back" href="/org/{data.org.id}">
					<img src="/icons/back.svg" alt="back"/>
				</a>
				
				<h2 class="clubName">{data.club.name}</h2>
			</div>
			<div class="nav">
				<a class:selected={route.id == '/(app)/org/[id]/club/[clubId]'} href={baseURL}>About</a>
				<a
					class:selected={route.id == '/(app)/org/[id]/club/[clubId]/announcements'}
					href="{baseURL}/announcements">Announcements</a
				>
				<a
					class:selected={route.id == '/(app)/org/[id]/club/[clubId]/events'}
					href="{baseURL}/events">Events</a
				>
				{#if data.clubPerms.admin || data.clubPerms.updateAppearance}
				<a
					class:selected={route.id == '/(app)/org/[id]/club/[clubId]/settings'}
					href="{baseURL}/settings">Settings</a
				>
				{/if}
			</div>
		</div>
	</div>
	<div class="inner">
		<slot />
	</div>
</div>

<style lang="scss">
	.title {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: start;
		margin-bottom: 25px;
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

	.wrap {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
	}

	.inner {
		display: flex;
		width: 90%;
		flex-direction: column;
		align-items: center;
		justify-content: center;
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
		align-items: center;
		flex-direction: row;

		a {
			margin-right: 20px;
			padding: 5px 0px;
			font-size: 1.1rem;
			text-decoration: none;
			color: var(--textColor);
			opacity: 0.9;
			position: relative;
			transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.3s;

			&::after {
				content: '';
				bottom: 0px;
				left: 0px;
				position: absolute;
				width: 100%;
				height: 2px;
				background: var(--accent);
				transition: transform cubic-bezier(0.075, 0.82, 0.165, 1) 0.3s;
				transform: scaleX(0);
			}

			&:hover {
				color: var(--accent);

				&::after {
					transform: scaleX(1);
				}
			}

			&.selected {
				color: var(--accent50);

				&::after {
					transform: scaleX(1);
					background: var(--accent50);
				}
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
</style>
