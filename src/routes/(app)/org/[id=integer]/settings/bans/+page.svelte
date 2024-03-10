<script lang="ts">
	import dayjs from 'dayjs';

	import { pushState } from '$app/navigation';
	import { page } from '$app/stores';
	export let data;
	import CalendarIcon from '~icons/bx/calendar-alt';
	import InfoIcon from '~icons/bx/info-circle';
	import MessageIcon from '~icons/bx/message';
	import UndoIcon from '~icons/bx/undo';
	import Button from '$lib/components/Button.svelte';
	import IconButton from '$lib/components/IconButton.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import { tooltip } from '$lib/components/tooltips/tooltip';

	let InspectingBan: (typeof data.bans)[0];

	const showBanInfo = (ban: typeof InspectingBan) => {
		InspectingBan = ban;
		pushState('', {
			showingModal: 'banInfo'
		});
	};
</script>

{#if $page.state.showingModal === 'banInfo'}
	<Modal on:close={() => history.back()}>
		<h2>{InspectingBan.user.firstName} {InspectingBan.user.lastName}</h2>
		<div class="banInfo">
			<div class="infoLine" title="Ban Date" use:tooltip={'Date Banned'}>
				<CalendarIcon />
				<p>{dayjs(InspectingBan.createdAt).format('MMMM DD, YYYY')}</p>
			</div>
			<div class="infoLine" title="Ban Reason" use:tooltip={'Ban reason'}>
				<MessageIcon />
				<p>{InspectingBan.reason || 'No reason given'}</p>
			</div>
		</div>
		<div class="buttons">
			<Button
				value="done"
				on:click={() => {
					history.back();
				}}
			/>
		</div>
	</Modal>
{/if}

<div class="bans">
	{#each data.bans as ban}
		<div class="ban">
			<div class="left">
				<img class="pfp" alt="Profile Identifier" src={ban.user.pfp || '/defaultPFP.png'} />
				<p class="name">{ban.user.firstName} {ban.user.lastName}</p>
			</div>

			<div class="info">
				<IconButton
					toolTipText="Ban Info"
					on:click={() => {
						showBanInfo(ban);
					}}
				>
					<InfoIcon />
				</IconButton>
				<IconButton
					formData={{
						method: 'post',
						action: '?/unbanMember'
					}}
					toolTipText="Unban"
				>
					<input name="banId" hidden value={ban.id} />
					<UndoIcon />
				</IconButton>
			</div>
		</div>
	{/each}
</div>

<style lang="scss">
	.bans {
		display: flex;
		flex-direction: column;
		align-items: start;
		justify-content: start;
		min-width: 500px;
	}
	.ban {
		background: var(--bgPure);
		width: 100%;
		margin-bottom: 10px;
		padding: 10px 20px;
		box-sizing: border-box;
		border-radius: 5px;
		box-shadow: 1px 1px 2px 2px rgba(0, 0, 0, 0.1);
		display: flex;
		flex-direction: row;

		.left {
			display: flex;
			flex-direction: row;
			width: 100%;

			.name {
				display: flex;
				align-items: center;
				justify-content: center;
				padding-left: 20px;
				margin: 0px;
				font-size: 1.2rem;
			}
		}
	}
	.pfp {
		aspect-ratio: 1/1;
		height: 32px;
		border: 1px solid var(--accent);
		border-radius: 50%;
	}

	.banInfo {
		min-width: 300px;
		display: flex;
		flex-direction: column;
		align-items: start;
		justify-content: center;
		margin-bottom: 10px;

		p {
			margin: 5px 0px;
		}
	}

	.info {
		display: flex;
	}

	.buttons {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.infoLine {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;

		p {
			margin-left: 5px;
		}
	}
</style>
