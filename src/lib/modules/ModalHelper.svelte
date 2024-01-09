<script lang="ts">
	import Modal from "./Modal.svelte"
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher<{
		close: undefined;
	}>();

	export let showing = false;

	let onClose = () => {
		dispatch('close')
		showing = false;
	};
</script>

<Modal on:close={onClose}><slot /></Modal>