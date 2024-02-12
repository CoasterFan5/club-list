<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import Modal from '$lib/components/Modal.svelte';
</script>

{#if $page.state.showingModal == 'joinOrg'}
	<Modal on:close={() => history.back()}>
		<form action="/org?/join" method="post" use:enhance>
			<h2>Join an Organization</h2>
			<div class="formInput">
				<Input name="joinCode" bg="white" label="Join Code" />
			</div>
			<div class="formInput">
				<Button type="submit" value="Join" />
			</div>
		</form>
	</Modal>
{/if}

<style lang="scss">
	.formInput {
		margin: 7px;
	}
</style>
