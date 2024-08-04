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
		<SettingsTemplate backLink="/org/{$page.params.id}/club/{$page.params.clubId}" pages={links}>
			<div class="settingsContent">
				<slot />
			</div>
		</SettingsTemplate>
	</div>
</div>

<style lang="scss">
	.wrap {
		width: 100%;
		flex-grow: 1;
	}
	.inner {
		width: 100%;
		height: 100%;
		background: var(--bg);
		display: flex;
		flex-direction: row;
		overflow: hidden;
	}

	.settingsContent {
		height: 100%;
		box-sizing: border-box;
		max-height: 100%;
		overflow-y: auto;
		width: 100%;
	}
</style>
