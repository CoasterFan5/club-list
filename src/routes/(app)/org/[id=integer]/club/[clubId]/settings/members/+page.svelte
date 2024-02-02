<script lang="ts">
	import { enhance } from '$app/forms';
	import { pushState } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$lib/components/Button.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import SearchBox from '$lib/components/SearchBox.svelte';
	import { addToast } from '$lib/components/toaster';
	import { tooltip } from '$lib/components/tooltips/tooltip';

	let searchBox: SearchBox<(typeof data)['roles'][number]>;

	let selectedId: number | null = null;
	export let data;
	export let form;

	$: if (form) {
		if (form.success) {
			addToast({
				type: 'success',
				message: form.message || 'success',
				life: 3000
			});
		} else {
			addToast({
				type: 'error',
				message: form.message || 'Error.',
				life: 3000
			});
		}
	}

	let kickMember = {
		id: 0,
		firstName: '',
		lastName: ''
	};

	const startKick = (id: number, firstName: string, lastName: string) => {
		kickMember = {
			id: id,
			firstName,
			lastName
		};
		pushState('', {
			showingModal: 'kickMember'
		});
	};
</script>

{#if $page.state.showingModal == 'kickMember'}
	<Modal
		on:close={() => {
			history.back();
		}}
	>
		<h1>Kicking Member</h1>
		<p>Are you sure you want to kick {kickMember.firstName} {kickMember.lastName}?</p>
		<form action="?/kickMember" method="post" use:enhance>
			<input name="userId" style="display: none" bind:value={kickMember.id} />
			<Button type="submit" value="Kick Member" />
		</form>
	</Modal>
{/if}

<SearchBox
	bind:this={searchBox}
	data={[data.roles, (role) => role.id, (role) => role.name]}
	let:filteredData
>
	{#each filteredData as role}
		<form action="?/updateMemberRole" method="post" use:enhance>
			<input name="userId" style="display: none" value={selectedId} />
			<input name="roleId" style="display: none" value={role.id} />

			<button style="--color: {role.color}" class="roleButton">
				<div class="color" />
				{role.name}
			</button>
		</form>
	{/each}
	<form action="?/updateMemberRole" method="post" use:enhance>
		<input name="userId" style="display: none" bind:value={selectedId} />
		<input name="roleId" style="display: none" value="-1" />

		<button style="--color: #fff" class="noRole"> No role </button>
	</form>
</SearchBox>

<main>
	{#if data.memberData.length > 0}
		<table>
			<thead>
				<tr>
					<th>Member</th>
					<th>Role</th>
					{#if data.clubPerms.manageMembers || data.clubPerms.admin}
						<th>Actions</th>
					{/if}
				</tr>
			</thead>
			<tbody>
				{#each data.memberData as member}
					<tr>
						<td>
							<div class="member tdInner">
								<img class="pfp" alt="profile" src={member.user.pfp || '/defaultPFP.png'} />
								{member.user.firstName}
								{member.user.lastName}
							</div>
						</td>
						<td style="--color: {member.role?.color}" class="role">
							<button
								class="changeRole"
								on:click|self={(e) => {
									selectedId = member.userId;
									searchBox.propagateClick(e);
								}}
							>
								{member.role?.name || 'None'}
							</button>
						</td>
						{#if data.clubPerms.manageMembers || data.clubPerms.admin}
							<td>
								<div class="actions">
									<button
										class="actionButton"
										use:tooltip={'Kick Member'}
										on:click={() => {
											startKick(member.userId, member.user.firstName, member.user.lastName);
										}}
									>
										<img class="icon" alt="kick" src="/icons/kick.svg" />
									</button>
								</div>
							</td>
						{/if}
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

	.actionButton {
		all: unset;
		display: block;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0px 10px;
		padding: 5px;
		box-sizing: border-box;
		cursor: pointer;
		border-radius: 50%;
		aspect-ratio: 1/1;
	}

	.actionButton:hover {
		background: var(--accent50);
	}

	.actions {
		text-align: center;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.roleButton {
		position: relative;
		all: unset;
		cursor: pointer;
		text-align: center;
		padding: 7px 10px;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		flex-direction: row;
		width: 100%;
		border-radius: 3px;
		transition: all cubic-bezier(0.55, 0.055, 0.675, 0.19) 0.05s;
	}
	.roleButton:hover {
		background: rgba(0, 0, 0, 0.15);
	}

	.color {
		background: var(--color);
		height: 12px;
		aspect-ratio: 1/1;
		border-radius: 50%;
		margin-right: 10px;
	}
	.noRole {
		position: relative;
		all: unset;
		background: rgba(0, 0, 0, 0.1);
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
