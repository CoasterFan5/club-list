<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { closeModal } from '$lib/closeModalEnhance';
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import Modal from '$lib/components/Modal.svelte';
</script>

{#if $page.state.showingModal == 'createOrg'}
	<Modal on:close={() => history.back()}>
		<form action="/org?/create" method="post" use:enhance={closeModal(() => history.back())}>
			<h2>Create Organization</h2>
			<div class="formInput">
				<Input name="name" bg="white" label="Organization Name" />
			</div>
			<div class="formInput">
				<Button type="submit" value="Create" />
			</div>
		</form>
	</Modal>
{/if}

<style lang="scss">
	.formInput {
		margin: 7px;
	}
</style>
