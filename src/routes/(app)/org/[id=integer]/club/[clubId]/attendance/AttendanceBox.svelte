<script lang="ts">
	import { enhance } from "$app/forms";
	import Checkbox from "$lib/components/Checkbox.svelte";

	export let attendanceEvent: {
		id: number;
		createdAt: Date;
		updatedAt: Date;
		clubId: number;
	}
	export let attendanceMember: {
		user: {
			firstName: string;
			lastName: string;
			pfp: string | null;
			id: number;
			attendanceMarks: {
				attendanceEvent: {
					id: number;
					createdAt: Date;
					updatedAt: Date;
					clubId: number;
				};
			}[];
		};
	}

	let formSubmitButton: HTMLButtonElement

	const changeData = () => {
		formSubmitButton.click()
	}
</script>

<Checkbox on:click={changeData} checked={attendanceMember.user.attendanceMarks.includes({attendanceEvent: attendanceEvent})}/>

<form hidden method="post" action="changeAttendance" use:enhance>
	<input name="userId" value={attendanceMember.user.id}/>
	<input name="eventId" value={attendanceEvent.id}/>
	<button bind:this={formSubmitButton}/>
</form>