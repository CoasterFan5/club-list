<script lang="ts">
	export let data;
	import IconButton from "$lib/components/IconButton.svelte"

	let showingInfo = false;

	const openInfo = (e: MouseEvent, ban: typeof data.bans[0]) => {
		
	}

</script>

<div class="bans">
	{#each data.bans as ban}
		<div class="ban">
			<div class="left">
				<img class="pfp" src={ban.user.pfp || "/defaultPFP.png"} alt="Profile Identifier"/>
				<p class="name">{ban.user.firstName} {ban.user.lastName}</p>
			</div>
			
			<div class="info">
				<IconButton on:click={(e) => {openInfo(e, ban)}}>
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill: rgba(0, 0, 0, 1);"><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"></path><path d="M11 11h2v6h-2zm0-4h2v2h-2z"></path></svg>
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

	

	button {
		display: flex;
	}
</style>