<script lang="ts">
	import Pfp from "$lib/components/Pfp.svelte";
	import Button from "$lib/components/Button.svelte"
	export let data;
	
	
</script>

<div class="wrap">
	<Button value="Add Attendance Event"/>
	{#each data.attendanceMembers as attendanceMember}
		<div class="attendanceItem">
			<div class="user">
				<Pfp pfp={attendanceMember.user.pfp}/>
				<p>{attendanceMember.user.firstName} {attendanceMember.user.lastName}</p>
			</div>
			
			
			{#each data.attendanceEvents as attendanceEvent }
				<div class="attendanceData">
					<h1></h1>
				</div>
			{/each}

			<form>

			</form>
			
		</div>	
	{/each}
</div>

<style lang="scss">
	.wrap {
		width: 90%;
		margin-top: 50px;
	}

	.attendanceItem {
		margin: 0.3rem 0rem;
		background: var(--bgMid);
		padding: 0.4rem;
		border-radius: 5px;
		box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.05);

		p {
			margin: 0px;
			font-size: 1.2rem;
		}
	}

	.user {
		display: flex;
		align-items: center;
		justify-content: start;
	}
</style>