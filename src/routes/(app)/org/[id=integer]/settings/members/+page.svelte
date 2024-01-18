<script>
    export let data;

</script>

<main>
	{#if data.orgUserData.length > 0}
		<table>
			<thead>
				<tr>
					<th>Member</th>
					<th>Role</th>
					<th>Actions</th>
				</tr>
			</thead>
			<tbody>
				{#each data.orgUserData as member}
					<tr>
						<td>
							<div class="member tdInner">
								<img class="pfp" alt="profile" src={member.user.pfp || '/defaultPFP.png'} />
								{member.user.firstName}
								{member.user.lastName}
							</div>
						</td>
						<td style="--color: {member.role}" class="role">
							<button
								class="changeRole"
							>
								{member.user.role || 'None'}
							</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{:else}
		<p><i>No members to manage yet.</i></p>
	{/if}
</main>

<style lang="scss">
    main {
		margin: 1rem;
	}
	table {
		width: 100%;
		border-spacing: 3px;
		border-color: transparent;
		padding-bottom: 50px;
	}
	tr {
		background: var(--bgPure);
	}
	td {
		width: 0.1%;
		white-space: nowrap;
		border-radius: 3px;
	}

	.member {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: start;
	}
	.changeRole {
		all: unset;
		height: 100%;
		width: 100%;
		cursor: pointer;
		padding: 3px 25px;
		box-sizing: border-box;
		text-align: center;
	}
	.tdInner {
		box-sizing: border-box;
		padding: 3px 25px;
		border-radius: 3px;
	}
	.pfp {
		height: 24px;
		border-radius: 50%;
		border: 1px solid var(--accent);
		margin-right: 10px;
        aspect-ratio: 1/1;
	}
	.role {
		position: relative;
		z-index: 4;
	}
	.role::after {
		position: absolute;
		content: '';
		top: 0px;
		left: 0px;
		height: 100%;
		width: 100%;
		z-index: -1;
		opacity: 0.5;
		background: var(--color);
	}
	.roleSelector {
		position: fixed;
		border-radius: 5px;
		box-shadow: 0px 0px 4px 4px rgba(0, 0, 0, 0.15);
		background: var(--bgMid);
		width: 250px;
		max-height: 400px;
		padding: 10px;
		box-sizing: border-box;
		z-index: 50;
	}
	.roleSelector input {
		position: relative;
		all: unset;
		background: rgba(0, 0, 0, 0.1);
		text-align: left;
		cursor: text;
		width: 100%;
		padding: 7px 10px;
		margin-bottom: 5px;
		box-sizing: border-box;
		width: 100%;
		border-radius: 3px;
		transition: all cubic-bezier(0.55, 0.055, 0.675, 0.19) 0.05s;
	}
	.roleSelector .roleButton {
		position: relative;
		all: unset;
		cursor: pointer;
		text-align: center;
		width: 100%;
		padding: 7px 10px;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		flex-direction: row;
		width: 100%;
		border-radius: 3px;
		transition: all cubic-bezier(0.55, 0.055, 0.675, 0.19) 0.05s;
	}
	.roleSelector .roleButton:hover {
		background: rgba(0, 0, 0, 0.15);
	}

	.color {
		background: var(--color);
		height: 12px;
		aspect-ratio: 1/1;
		border-radius: 50%;
		margin-right: 10px;
	}
	.clickInterceptor {
		all: unset;
		position: fixed;
		height: 100%;
		width: 100%;
		z-index: 49;
		top: 0px;
		left: 0px;
	}
	.noRole {
		position: relative;
		all: unset;
		background: rgba(0, 0, 0, 0.1);
		text-align: left;
		width: 100%;
		padding: 7px 10px;
		margin-top: 5px;
		box-sizing: border-box;
		cursor: pointer;
		width: 100%;
		border-radius: 3px;
		transition: all cubic-bezier(0.55, 0.055, 0.675, 0.19) 0.05s;
		text-align: center;
	}
	.noRole:hover {
		background: rgba(0, 0, 0, 0.15);
	}
</style>