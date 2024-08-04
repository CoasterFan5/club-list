<script lang="ts">
	import CloseIcon from '~icons/bx/x';
	import { page } from '$app/stores';
	import SettingsTemplate from '$lib/components/SettingsTemplate.svelte';
	let baseUrl = `/org/${$page.params.id}/club/${$page.params.clubId}/settings`;

	export let data;

	const links = [
		{
			title: 'Primary Settings',
			links: [
				{
					title: 'General',
					href: `${baseUrl}`
				},
				{
					title: 'Roles',
					href: `${baseUrl}/roles`
				},
				{
					title: 'Members',
					href: `${baseUrl}/members`
				},
				{
					title: 'Integrations',
					href: `${baseUrl}/integrations`
				}
			]
		}
	];
</script>

<div class="wrap">
	<div class="inner">
		<a class="closeIcon" href="/org/{$page.params.id}/club/{$page.params.clubId}">
			<CloseIcon height="2rem" width="2rem" />
		</a>
		<SettingsTemplate backLink="/org/{$page.params.id}/club/{$page.params.clubId}" pages={links}>
			<slot />
		</SettingsTemplate>
	</div>
</div>

<style lang="scss">
	.wrap {
		width: 100%;
		height: 100%;
	}
	.inner {
		width: 100%;
		height: 100%;
		background: var(--bg);
		display: flex;
		flex-direction: row;
		border-radius: 0.5rem;
		overflow: hidden;
	}

	.closeIcon {
		all: unset;
		position: absolute;
		top: 1rem;
		padding: 0.5rem;
		right: 1rem;
		transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.5s;
		cursor: pointer;

		&:hover {
			transform: rotate(15deg);
		}
	}
</style>
