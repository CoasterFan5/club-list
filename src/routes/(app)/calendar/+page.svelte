<script>
	import Calendar from "$lib/components/Calendar.svelte";

	export let data;
</script>

<Calendar bind:events={data.events}/>