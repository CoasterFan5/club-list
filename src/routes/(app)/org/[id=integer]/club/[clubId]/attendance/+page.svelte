<script lang="ts">
	import Pfp from "$lib/components/Pfp.svelte";
	import Button from "$lib/components/Button.svelte"
	import Checkbox from "$lib/components/Checkbox.svelte"
	import AttendanceBox from "./AttendanceBox.svelte";
	import { handleForm } from "$lib/utils/formToaster";
	import { enhance } from "$app/forms";
	export let data;
	export let form;

	$: handleForm(form)
	
</script>

<div class="wrap">
	<form method="post" action="?/createAttendanceEvent" use:enhance>
		<Button value="Add Attendance Event"/>
	</form>
	
	<table class="attendance">
		<thead>
			<td>Member</td>
			{#each data.attendanceEvents as attendanceEvent}
				<td class="eventTitleHead"><p>
					Monday Meeting
				</p></td>
			{/each}
		</thead>
		{#each data.attendanceMembers as attendanceMember}

			<tr class="attendanceItem">
				<td class="userItem">
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
		height: 100%;
		height: fit-content;
		margin-top: 50px;
		padding-bottom: 50px;
		overflow-x: auto;
		overflow-y: clip;
	}
	.attendance {
		table-layout: fixed;
		padding-top: 5rem;
	}
	.eventTitleHead {
		position: relative;
		width: 1rem;
		text-align: center;
		
		p {
			text-align: center;
			width: 5rem;
			position: absolute;
			bottom: 2.5rem;
			left: 0rem;
			background: var(--bgMid);
			height: 2rem;
			text-wrap: nowrap;
			overflow: hidden;
			
			
			transform: rotate(-60deg);
		}
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

	.userItem {
		max-width: 15rem;
		min-width: 15rem;
		position: relative;
	}
	.user {
		top: 0px;
		left: 0px;
		height: 100%;
		position: absolute;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: start;
		padding: 0.2rem 0.5rem;
		text-wrap: nowrap;
		width: 14rem;
		max-width: 14rem;
		overflow: hidden;
		
		
	}
</style>