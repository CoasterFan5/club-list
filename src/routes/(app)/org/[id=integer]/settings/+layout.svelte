<script lang="ts">
	export let data;
</script>

<div class="wrap">
	<div class="sidebar">
		<div class="top">
			<h6>Primary Settings</h6>
			<a href="/org/{data.org.id}/settings">General</a>
			<a href="/org/{data.org.id}/settings/visibility">Visibility</a>
			<a href="/org/{data.org.id}/settings/danger">Danger</a>
			<hr />
			<h6>Member Settings</h6>
			<a href="/org/{data.org.id}/settings/members">Members</a>
			<!-- - <a href="/org/{data.org.id}/settings/members">Bans</a> -->
			<a href="/org/{data.org.id}/settings/roles">Roles</a>

			<hr />
		</div>

		<a href="/org/{data.org.id}">Done</a>
	</div>
	<div class="inner">
		<div class="content">
			<div class="contentInner">
				<slot />
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	.wrap {
		height: 100%;
		width: 100%;
		top: 0px;
		left: 0px;
		background: var(--bg);
		display: flex;
		flex-direction: row;
	}
	.inner {
		width: 100%;
		height: 100%;
		min-width: 500px;
		padding: 50px;
		box-sizing: border-box;
		display: flex;
		flex-direction: row;
		align-items: center;
		overflow-y: auto;
	}
	.sidebar {
		
		
		background: var(--bgMid);
		height: 100%;
		box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.1);
		text-align: center;
		display: flex;
		border-radius: 3px;
		flex-direction: column;
		align-items: end;
		justify-content: start;
		min-width: 200px;
		width: 40%;
		padding: 50px 0px;
		box-sizing: border-box;
		position: relative;
		top: 0px;
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
		width: 150px;
		padding: 5px 10px;
		box-sizing: border-box;
		border-radius: 3px;
		margin-bottom: 2px;
		text-align: left;
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
		align-items: center;
		justify-content: center;
	}
	.contentInner {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: start;
		box-sizing: border-box;
	}
	h6 {
		font-weight: 600;
		margin: 5px 0px;
		font-size: 0.8rem;
	}
	hr {
		all: unset;
		margin: 5px 0px;
		width: calc(100% - 10px);
		border-bottom: 1px solid rgba(0, 0, 0, 0.2);
		box-sizing: border-box;
	}
</style>
