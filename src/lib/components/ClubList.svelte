<script lang="ts">
	type club = {
		id: number;
		createdAt: Date | null;
		updatedAt: Date | null;
		name: string;
		description: string | null;
		imageURL: string | null;
		ownerId: number;
		organizationId: number;
		openToJoin: boolean;
	};

	export let clubs: club[] = [];

	let clubContainerWidth: number;
	let clubCount;
	let clubsPerRow;
	let sudoPlaceholders = 0;
	$: if (clubContainerWidth) {
		clubCount = clubs.length;
		clubsPerRow = Math.floor(clubContainerWidth / 350);

		if (clubCount % clubsPerRow != 0) {
			sudoPlaceholders = clubsPerRow - (clubCount % clubsPerRow);
		} else {
			sudoPlaceholders = 0;
		}
	}
</script>

<div class="clubs" bind:clientWidth={clubContainerWidth}>
	{#each clubs as club (club.id)}
		<a class="club" href="/org/{club.organizationId}/club/{club.id}">
			<div class="clubInner">
				{#if club.imageURL}
					<img class="clubImage" alt="{club.name} background image" src={club.imageURL} />
				{:else}
					<img class="clubImage" alt="{club.name} background image" src="/dino" />
				{/if}
				<div class="clubText">
					<h2>{club.name}</h2>
				</div>
			</div>
		</a>
	{/each}

	{#if sudoPlaceholders > 0}
		{#each { length: sudoPlaceholders } as i}
			<!-- svelte-ignore a11y-missing-content -->
			<a class="club" hidden href="/{i}" />
		{/each}
	{/if}
</div>

<style lang="scss">
	.clubs {
		width: 100%;
		flex-grow: 1;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;

		.clubInner {
			position: relative;
			display: flex;
			background: var(--bgPure);
			width: 100%;
			height: 100%;
			z-index: 0;
			transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.5s;
			border-radius: 3px;

			&:hover {
				box-shadow: 0px 0px 4px 4px rgba(0, 0, 0, 0.15);
				transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.5s;
			}
		}
	}
	.club {
		aspect-ratio: 5/2;

		width: calc(100% / 3);
		padding: 0px 10px 20px 10px;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 350px;
		flex: 1 1 0;
		width: 0px;
		transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.5s;
	}

	.clubImage {
		position: absolute;
		width: 100%;
		height: 100%;
		z-index: -1;
		overflow: hidden;
		object-fit: cover;
		border-radius: 3px;
	}

	.clubText {
		position: absolute;
		bottom: 0px;
		left: 0px;
		width: 100%;
		color: var(--textLight);
		border-radius: 0px 0px 3px 3px;

		&::after {
			content: '';
			position: absolute;
			background: var(--mid);
			bottom: 0px;
			left: 0px;
			border-radius: 0px 0px 3px 3px;
			opacity: 0.8;
			z-index: -1;
			width: 100%;
			height: 100%;
		}

		& > h2 {
			margin: 5px;
			font-weight: normal;
		}
	}
</style>
