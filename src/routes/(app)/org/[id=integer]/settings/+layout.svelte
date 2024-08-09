<script lang="ts">
	import SettingsTemplate, {
		type SettingsLinkTemplate
	} from '$lib/components/SettingsTemplate.svelte';

	export let data;

	const linkSections: SettingsLinkTemplate = [
		{
			title: 'Primary Settings',
			links: [
				{
					title: 'General',
					href: `/org/${data.org.id}/settings`
				},
				{
					title: 'Visibility',
					href: `/org/${data.org.id}/settings/visibility`
				},
				{
					title: 'Danger',
					href: `/org/${data.org.id}/settings/danger`
				}
			]
		},
		{
			title: 'Member Settings',
			links: [
				{
					title: 'Members',
					href: `/org/${data.org.id}/settings/members`
				},
				{
					title: 'Bans',
					href: `/org/${data.org.id}/settings/bans`
				},
				{
					title: 'Roles',
					href: `/org/${data.org.id}/settings/roles`
				}
			]
		}
	];
</script>

<SettingsTemplate backLink="/org/{data.org.id}" pages={linkSections}>
	<slot />
</SettingsTemplate>
