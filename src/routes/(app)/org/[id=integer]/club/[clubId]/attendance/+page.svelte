<script lang="ts">
	export let data;
	
	
</script>

<div class="wrap">
	{#each data.attendanceMembers as attendanceMember}
		<div class="attendanceItem">
			<p>{attendanceMember.user.firstName} {attendanceMember.user.lastName}</p>
			
			{#each data.attendanceEvents as attendanceEvent }
				<div class="attendanceData">
					
				</div>
			{/each}
		</div>	
	{/each}
</div>

<style lang="scss">
	.wrap {
		width: 90%;
		margin-top: 50px;
	}

	.attendanceItem {
		margin: 0.25rem 0rem;
		background: var(--bgMid);
		padding: 0.4rem;
		border-radius: 5px;

		p {
			margin: 0px;
			font-size: 1.2rem;
		}
	}
</style>