<script lang="ts">
	import Pfp from "$lib/components/Pfp.svelte";
	import Button from "$lib/components/Button.svelte"
	import Checkbox from "$lib/components/Checkbox.svelte"
	import AttendanceBox from "./AttendanceBox.svelte";
	import { handleForm } from "$lib/utils/formToaster";
	export let data;
	export let form;

	$: handleForm(form)
	
</script>

<div class="wrap">
	<form method="post" action="?/createAttendanceEvent">
		<Button value="Add Attendance Event"/>
	</form>
	
	<table class="attendance">
		<thead>
			<td>Member</td>
			{#each data.attendanceEvents as attendanceEvent}
				<td>Event</td>
			{/each}
		</thead>
		{#each data.attendanceMembers as attendanceMember}

			<tr class="attendanceItem">
				<td>
					<div class="user">
						<Pfp pfp={attendanceMember.user.pfp}/>
						<p>{attendanceMember.user.firstName} {attendanceMember.user.lastName}</p>
					</div>
					
				</td>
				
				
				{#each data.attendanceEvents as attendanceEvent }
					<td class="attendanceItem">
						<AttendanceBox {attendanceEvent} {attendanceMember}/>
					</td>
					
				{/each}
			</tr>	
		{/each}
	</table>
	
</div>

<style lang="scss">
	.wrap {
		width: 90%;
		margin-top: 50px;
		padding-bottom: 50px;
	}



	p {
		margin: 0px;
		font-size: 1.2rem;
	}
	
	tr {
		margin: auto;
	}

	td {
		padding: 0.2rem 0.3rem;
		box-sizing: border-box;
		border-radius: 3px;
		background: var(--bgMid);
		box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.05);
		
	}

	.attendanceMarks {
		position: absolute;
		right: 0px;
		z-index: 1;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.user {
		display: flex;
		align-items: center;
		justify-content: start;
		padding: 0.2rem 0.5rem;
		height: 100%;
		
	}
</style>