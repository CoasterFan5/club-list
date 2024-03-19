<script lang="ts">
	export let pfp: string | null;
	export let height = "24px";
</script>

<img class="pfp" alt="profile" src={pfp || '/defaultPFP.png'} style="height: {height};" />

<style class="scss">
	.pfp {
		border-radius: 50%;
		border: 1px solid var(--accent);
		margin-right: 10px;
		aspect-ratio: 1 / 1;
		object-fit: cover;
	}
</style>