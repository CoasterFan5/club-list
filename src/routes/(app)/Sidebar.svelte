<script lang="ts">
	import type { LayoutData } from "./$types";
	export let data: LayoutData;

	let pfp = data.user.pfp || "/defaultPFP.png"
</script>


<nav class="sidebar">
	<a href="/profile" class="pfp">
		<img class="pfpImage" src={pfp} alt="profile">
	</a>
	<a href="/dashboard" class="button">
		<img class="img" src="/icons/home.svg" alt="home"/>
	</a>
	<a href="/org" class="button">
		<img class="img" src="/icons/orgs.svg" alt="home"/>
	</a>
</nav>
	




<style>
	.sidebar {
		width: 75px;
		padding: 12px;
		box-sizing: border-box;
		background: var(--bgPure);
		height: 100vh;
	}
	.pfp {
		border-radius: 5px;
		overflow: hidden;
		display: flex;
		width: 100%;
		aspect-ratio: 1/1;
		border-radius: 5px;
		position: relative;
		overflow: hidden;
		
	}
	.pfpImage {
		width: 100%;
		aspect-ratio: 1/1;
		resize: vertical;
		z-index: 3;
		border: 2px solid var(--accent);
		border-radius: 5px;
		opacity: 1;
		overflow: hidden;
		object-fit: cover;
		
	}
	.pfp::after {
		content: "";
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0px;
		left: 0px;
		background: var(--bgPure);
	}
	.button {
		display: flex;
		width: 100%;
		padding: 10px;
		box-sizing: border-box;
		margin: 5px 0px;
		aspect-ratio: 1/1;
		transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.5s;
	}
	.button img {
		filter: var(--redIconFilter);
		aspect-ratio: 1/1;
		width: 100%;
		height: 100%;
	}
	.button:hover {
		background: var(--accent50);
		border-radius: 5px;
	}
	
</style>