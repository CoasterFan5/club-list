<script>
	import Button from "$lib/components/Button.svelte";

</script>

<main>
	<h2>Danger Zone</h2>

	<form>
		<Button value="Refresh Join Code"/>
	</form>
	<form>
		<Button value="Transfer Ownership"/>
	</form>
	<form>
		<Button value="Delete Organization"/>
	</form>
	
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		max-width: 500px;
		width: 100%;
	}
	form {
		width: 100%;
		margin: 5px 0px;
	}
</style>