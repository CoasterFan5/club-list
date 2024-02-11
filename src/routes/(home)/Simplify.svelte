<script lang="ts">
	import SimplifyClub from './SimplifyClub.svelte';
</script>

<div class="wrap">
	<div class="simplify">
		<SimplifyClub name="Student Council" real={false} />
		<SimplifyClub name="Film Club" real={false} />
		<SimplifyClub name="Yearbook" real={false} />
		<SimplifyClub name="Robotics" real={false} />
		<SimplifyClub name="Find" real={true} />
		<SimplifyClub name="NHS" real={false} />
		<SimplifyClub name="Whats" real={true} />
		<SimplifyClub name="Squirrel Club" real={false} />
		<SimplifyClub name="Math Club" real={false} />
		<SimplifyClub name="SCA" real={false} />
		<SimplifyClub name="Code Club" real={false} />
		<SimplifyClub name="Important" real={true} />
	</div>
</div>

<style lang="scss">
	.wrap {
		display: flex;
		width: 100%;
		padding: 50px 0px;
		align-items: center;
		justify-content: center;
	}

	.simplify {
		display: flex;
		padding: 10px;
		box-sizing: border-box;
		flex-direction: row;
		flex-wrap: wrap;

		width: 90%;

		background: var(--bgPure);

		position: relative;
		border-radius: 10px;
	}
</style>
