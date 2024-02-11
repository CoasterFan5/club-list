<script lang="ts">
	import SimplifyClub from "./SimplifyClub.svelte";
	

	

	

	
</script>


<div class="wrap">
	<div class="simplify">
		<SimplifyClub name="Student Council" real={false}/>
		<SimplifyClub name="Film Club" real={false}/>
		<SimplifyClub name="Yearbook" real={false}/>
		<SimplifyClub name="Robotics" real={false}/>
		<SimplifyClub name="Find" real={true}/>
		<SimplifyClub name="NHS" real={false}/>
		<SimplifyClub name="Whats" real={true}/>
		<SimplifyClub name="Squirrel Club" real={false}/>
		<SimplifyClub name="Math Club" real={false}/>
		<SimplifyClub name="SCA" real={false}/>
		<SimplifyClub name="Code Club" real={false}/>
		<SimplifyClub name="Important" real={true}/>
	</div>
</div>


<style lang="scss">
	h2 {
		text-align: center;
	}

	.wrap {
		display: flex;
		width: 100%;
		padding: 25px 0px;
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

		h2 {
			z-index: 5;
			background: var(--bg);
			padding: 20px;
			border-radius: 5px;
			font-weight: 500;
			font-size: 2rem;
		}
	}

	.simplifyText {
		width: 100%;
		height: 100%;
		word-break: break-all;
		position: absolute;
		top: 0px;
		left: 0px;
		overflow: hidden;
		overflow-y: hidden;
		color: rgba(0, 0, 0, 0.5);
		font-size: 1.2rem;
	}

	.hiddenClub {
		transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 5s;
		border: 1px solid transparent;
		border-radius: 100px;
		position: relative;
	}

	.shown {
		background: var(--accent50);
		opacity: 1;

		&::after {
			transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 5s;
			opacity: 1;
			border-radius: 100px;
			border: 1px solid var(--accent);
		}
	}
</style>
