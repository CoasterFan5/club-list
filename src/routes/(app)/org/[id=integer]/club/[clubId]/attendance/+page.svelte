<script lang="ts">
	import Pfp from "$lib/components/Pfp.svelte";
	import Button from "$lib/components/Button.svelte"
	import Checkbox from "$lib/components/Checkbox.svelte"
	import AttendanceBox from "./AttendanceBox.svelte";
	import { handleForm } from "$lib/utils/formToaster";
	import { enhance } from "$app/forms";
	import IconButton from "$lib/components/IconButton.svelte"
	import ComboBox from "$lib/components/ComboBox.svelte"

	import DeleteIcon from "~icons/bx/trash"
	export let data;
	export let form;

	$: handleForm(form)

	
</script>



<div class="wrap" style="--itemCount: {data.attendanceMembers.length}" >
	<form method="post" action="?/createAttendanceEvent" use:enhance>
		
		
	</form>

	<div class="editBar">
		<ComboBox label="Select Event" options={[data.allEvents, (item) => item.id.toString(), (item) => item.id]}/>
	</div>
	
	<table class="attendance" >
		<thead>
			<td>Member</td>
			<td class="eventTitleHead"><p>
				Monday Meeting
			</p></td>
		</thead>
		{#each data.attendanceMembers as attendanceMember}

			<tr class="attendanceItem">
				<td class="userItem">
					<div class="user">
						<Pfp pfp={attendanceMember.user.pfp}/>
						<p>{attendanceMember.user.firstName} {attendanceMember.user.lastName}</p>
					</div>
					
				</td>
				
				
					<td class="attendanceItem">
						<AttendanceBox attendanceEvent={data.attendanceEvent} {attendanceMember}/>
					</td>
					
				
			</tr>	
		{/each}
		<tr class="attendanceItem">
			<td class="userItem">
				<div class="user">
					<DeleteIcon/> <p>Delete Event</p>
				</div>
				
			</td>
			
		</tr>
	</table>
	
</div>

<style lang="scss">
	.wrap {
		position: absolute;
		width: 90%;
		
		overflow-x: auto;
		margin-top: 50px;
		padding-bottom: 50px;
		
		
	}

	.editBar {
		padding-top: 1rem;
	}

	.attendance {
		table-layout: fixed;
		height: 100%;
		padding-top: 1rem;
		
		
	}
	.eventTitleHead {
		position: relative;
		width: 2rem;
		max-width: 2rem;
		overflow: hidden;
		text-align: center;
		transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.5s;

		
		
		p {
			text-align: center;
			transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.5s;
			
			
			left: 0rem;
			background: var(--bgMid);
			
			text-wrap: nowrap;
			overflow: hidden;
			display: flex;
			align-items: center;
			justify-content: start;
			
			
			
		}
	}

	.active {
		max-width: 12rem;
		transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.5s;
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
		
		right: 0px;
		z-index: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 2.5rem;
		width: 3rem;
	}

	.userItem {
		max-width: 15rem;
		min-width: 15rem;
		height: 2.5rem;
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
		height: 2.5rem;
		padding: 0.2rem 0.5rem;
		text-wrap: nowrap;
		width: 14rem;
		max-width: 14rem;
		overflow: hidden;
		
		
	}
</style>