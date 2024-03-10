<script lang="ts">
	export let data;
</script>

<div class="bans">
	{#each data.bans as ban}
		<div class="ban">
			<img class="pfp" src={ban.user.pfp || "/defaultPFP.png"} alt="Profile Identifier"/>
			<p class="name">{ban.user.firstName} {ban.user.lastName}</p>
			
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

		.name {
			display: flex;
			align-items: center;
			justify-content: center;
			padding-left: 20px;
			margin: 0px;
			font-size: 1.2rem;
		}
	}
	.pfp {
		aspect-ratio: 1/1;
		height: 32px;
		border: 1px solid var(--accent);
		border-radius: 50%;
	}
</style>