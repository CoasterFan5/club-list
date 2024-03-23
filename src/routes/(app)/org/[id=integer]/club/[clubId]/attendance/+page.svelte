<script lang="ts">
	import DeleteIcon from '~icons/bx/trash';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import ComboBox from '$lib/components/ComboBox.svelte';
	import IconButton from '$lib/components/IconButton.svelte';
	import Pfp from '$lib/components/Pfp.svelte';
	import { handleForm } from '$lib/utils/formToaster';

	import AttendanceBox from './AttendanceBox.svelte';
	export let data;
	export let form;

	$: handleForm(form);

	const handleSelect = (value: string) => {
		$page.url.searchParams.set('eventId', value);
		goto($page.url, {
			invalidateAll: true
		});
	};
</script>

<div style="--itemCount: {data.attendanceMembers.length}" class="wrap">
	<form action="?/createAttendanceEvent" method="post" use:enhance />

	<div class="editBar">
		<ComboBox
			style="min-width: 20rem"
			label="Select Event"
			options={[data.allEvents, (item) => item.name, (item) => item.id]}
			on:selectOption={(event) => {
				handleSelect(event.detail.value);
			}}
		/>
		<IconButton>
			<DeleteIcon height="100%" />
		</IconButton>
	</div>
	<div class="users">
		{#each data.attendanceMembers as attendanceMember}
			<div class="user">
				<Pfp
					borderRadius="0.3rem"
					height="7rem"
					marginRight="0px"
					pfp={attendanceMember.user.pfp}
				/>
				{#key data.attendanceEvent}
					<AttendanceBox attendanceEvent={data.attendanceEvent} {attendanceMember} />
				{/key}
			</div>
		{/each}
	</div>
</div>

<style lang="scss">
	.wrap {
		width: 90%;
		margin-top: 50px;
		padding-bottom: 50px;
	}

	.users {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		padding: 1rem 0rem;
		flex-wrap: wrap;
	}
	.user {
		padding: 0.5rem;
		margin: 0.25rem;
		box-shadow: 1px 1px 3px 3px rgba(0, 0, 0, 0.1);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
		background: var(--bgMid);
	}
	.editBar {
		padding: 0.75rem;
		border-radius: 5px;
		box-sizing: border-box;
		display: flex;
		align-items: start;
		background: var(--bgMid);
		box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.1);
	}
</style>
