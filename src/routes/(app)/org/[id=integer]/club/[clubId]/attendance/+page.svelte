<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto, pushState } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$lib/components/Button.svelte';
	import ComboBox from '$lib/components/ComboBox.svelte';
	import IconButton from '$lib/components/IconButton.svelte';
	import Input from '$lib/components/Input.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import Pfp from '$lib/components/Pfp.svelte';
	import { handleForm } from '$lib/utils/formToaster';

	import AttendanceBox from './AttendanceBox.svelte';
	export let data;
	export let form;

	import QRCode from 'qrcode';
	import { onMount } from 'svelte';

	import RenameIcon from '~icons/bx/pencil';
	import AddIcon from '~icons/bx/plus';
	import QrIcon from '~icons/bx/qr';
	import DeleteIcon from '~icons/bx/trash-alt';
	import { tooltip } from '$lib/components/tooltips/tooltip';

	$: handleForm(form);

	const handleSelect = (value: string) => {
		$page.url.searchParams.set('eventId', value);
		goto($page.url, {
			invalidateAll: true
		});
	};

	const openRenameDialog = () => {
		pushState('', {
			showingModal: 'renameAttendanceEvent'
		});
	};

	let confirmDeleteValue: undefined | string = undefined;
	const openDeleteDialog = () => {
		pushState('', {
			showingModal: 'deleteAttendanceEvent'
		});
	};
	let showingQrCode = false;
	let qrCodeData: string;
	onMount(async () => {
		qrCodeData = await QRCode.toDataURL(
			`${window.location.origin}/attendance?id=${data.attendanceEvent.id}&code=${data.attendanceEvent.attendanceCode}`,
			{
				errorCorrectionLevel: 'H',
				type: 'image/png',
				margin: 1,
				scale: 4,
				width: 1000,
				color: {
					dark: '#e63946',
					light: '#00000000'
				}
			}
		);
	});
	const openQrDialog = () => {
		showingQrCode = true;
	};
</script>

{#if $page.state.showingModal == 'renameAttendanceEvent'}
	<Modal
		on:close={() => {
			history.back();
		}}
	>
		<form class="modalForm" action="?/renameEvent" method="post" use:enhance>
			<h2>Rename Event</h2>
			<input name="eventId" hidden value={data.attendanceEvent.id} />
			<Input name="name" autocomplete="off" bg="var(--bgPure)" label="New Name" />
			<hr />
			<Button value="Rename" />
		</form>
	</Modal>
{/if}

{#if $page.state.showingModal == 'deleteAttendanceEvent'}
	<Modal
		on:close={() => {
			history.back();
		}}
	>
		<form class="modalForm" action="?/deleteEvent" method="post" use:enhance>
			<h2>Delete Event</h2>
			<p>Are you sure?</p>
			<p>This well delete all data associated as well!</p>
			<p>To confirm, enter <strong>{data.attendanceEvent.name}</strong> below:</p>
			<hr />
			<input name="eventId" hidden value={data.attendanceEvent.id} />
			<Input
				name="name"
				autocomplete="off"
				bg="var(--bgPure)"
				label="Confirm"
				bind:value={confirmDeleteValue}
			/>
			<hr />
			<Button disabled={data.attendanceEvent.name != confirmDeleteValue} value="Delete" />
		</form>
	</Modal>
{/if}

{#if showingQrCode}
	<Modal
		on:close={() => {
			showingQrCode = false;
		}}
	>
		{#if !data.attendanceEvent.attendanceCode}
			<form class="modalForm" action="?/enableQr" method="post" use:enhance>
				<h2>Enable QR Code Attendance</h2>
				<p>QR code attendance will generate a qr code which club members can scan.</p>
				<p>This action is not reversible and will be tied to this event.</p>
				<hr />
				<input name="eventId" hidden value={data.attendanceEvent.id} />
				<Button value="Create QR Code" />
			</form>
		{:else}
			<h2>Qr Code</h2>
			<div style="width: 15rem" class="qrImage">
				<img alt="Qr Code" src={qrCodeData} width="100%" />
			</div>
			<div class="noExpandText">
				<p>
					If members scan this code, they will be marked present for this event. You can right click
					the qr code to save/copy the image in a larger size.
				</p>
			</div>

			<hr />
		{/if}
	</Modal>
{/if}

<div style="--itemCount: {data.attendanceMembers.length}" class="wrap">
	<form action="?/createAttendanceEvent" method="post" use:enhance />

	<div class="editBar">
		{#key data.allEvents}
			<ComboBox
				style="min-width: 20rem"
				label="Select Event"
				options={[data.allEvents, (item) => item.name, (item) => item.id]}
				placeholder={data.attendanceEvent.name}
				on:selectOption={(event) => {
					handleSelect(event.detail.value);
				}}
			/>
		{/key}

		{#if data.clubPerms.manageAttendance || data.clubPerms.admin}
			<div class="actions">
				<div use:tooltip={'Add Event'}>
					<IconButton
						formData={{
							method: 'post',
							action: '?/createAttendanceEvent'
						}}
					>
						<AddIcon height="100%" />
					</IconButton>
				</div>
				<div use:tooltip={'Rename Event'}>
					<IconButton on:click={openRenameDialog}>
						<RenameIcon height="100%" />
					</IconButton>
				</div>
				<div use:tooltip={'Delete Event'}>
					<IconButton on:click={openDeleteDialog}>
						<DeleteIcon height="100%" />
					</IconButton>
				</div>
				<div use:tooltip={'QR Attendance'}>
					<IconButton on:click={openQrDialog}>
						<QrIcon />
					</IconButton>
				</div>
			</div>
		{/if}
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

				<AttendanceBox attendanceEvent={data.attendanceEvent} {attendanceMember} />
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
		position: relative;
		padding: 0.75rem;
		border-radius: 5px;
		box-sizing: border-box;
		display: flex;
		justify-content: start;
		align-items: stretch;
		background: var(--bgMid);
		box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.1);
	}
	.actions {
		div {
			height: 100%;
		}
		box-sizing: border-box;
		width: 100%;
		display: flex;
		align-items: center;
		flex-direction: row;
		padding: 0.25rem 0rem;
		padding-left: 1rem;
		justify-content: start;
	}

	.modalForm {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		p {
			margin: 0.25rem;
		}

		hr {
			color: transparent;
		}
	}

	.qrImage {
		min-width: 250px;
		max-width: 1920px;
	}

	.noExpandText {
		max-width: 20rem;
	}
</style>
