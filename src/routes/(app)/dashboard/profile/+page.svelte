<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
</script>

<h1>Profile</h1>

<form use:enhance action="/logout" method="post">
	<Button type="submit" value="Log Out" />
</form>
