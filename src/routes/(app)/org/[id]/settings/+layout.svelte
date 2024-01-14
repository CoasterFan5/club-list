<script lang="ts">
	import type { PageData } from "./$types";

	export let data: PageData;
</script>

<div class="wrap">
	<div class="inner">
		<div class="sidebar">
			<div class="top">
				<a href="/org/{data.org.id}/settings">General</a>
			</div>
			<a href="/org/{data.org.id}">Done</a>
			
		</div>
		<div class="content">
			<div class="contentInner">
				<slot/>
			</div>
			
		</div>
	</div>
</div>


<style>
	.wrap {
		position: fixed;
		height: 100vh;
		width: 100%;
		top: 0px;
		left: 0px;
		background: var(--bg);
		z-index: 1001;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.inner {
		width: 80%;
		height: 90%;
		min-width: 500px;
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	.sidebar {
		background: var(--bgPure);
		height: 100%;
		padding: 0px;
		box-sizing: border-box;
		box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.1);
		text-align: center;
		display: flex;
		border-radius: 3px;
		flex-direction: column;
		align-items: start;
		justify-content: start;
		padding: 5px
	}
	.top {
		height: 100%;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: start;
	}
	.sidebar a {
		all: unset;
		cursor: pointer;
		width: 100%;
		padding: 10px 20px;
		box-sizing: border-box;
		border-radius: 3px;
		margin-bottom: 2px;
	}
	.sidebar a:hover {
		background: var(--accent50);
		
	}
	.content {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: row;
		text-align: center;
		align-items: start;
		justify-content: center;
	}
	.contentInner {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: row;
		text-align: center;
		align-items: start;
		justify-content: center;
		box-sizing: border-box;
		padding-left: 25px;
	}
</style>