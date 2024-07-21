<script lang="ts">
	import { page } from '$app/stores';
	import CloseIcon from '~icons/bx/x';
	let baseUrl = `/org/${$page.params.id}/club/${$page.params.clubId}/settings`;

	export let data;
</script>

<div class="wrap">
	<div class="inner">
		<a class="closeIcon" href="/org/{$page.params.id}/club/{$page.params.clubId}">
			<CloseIcon height="2rem" width="2rem" />
		</a>
		<nav class="navbar">
			<div class="top">
				<h6>Primary Settings</h6>
				<a class="link" class:active={data.pathname === baseUrl} href={baseUrl}>General</a>
				<a class="link" class:active={data.pathname === `${baseUrl}/roles`} href="{baseUrl}/roles"
					>Roles</a
				>
				<a
					class="link"
					class:active={data.pathname === `${baseUrl}/members`}
					href="{baseUrl}/members">Members</a
				>
				<a
					class="link"
					class:active={data.pathname === `${baseUrl}/members`}
					href="{baseUrl}/members">Integrations</a
				>
			</div>
			<a
				class="link"
				class:active={data.pathname === `${baseUrl}`}
				href="/org/{$page.params.id}/club/{$page.params.clubId}">Done</a
			>
		</nav>
		<div class="content">
			<div class="contentInner">
				<slot />
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	.wrap {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 1000;
		backdrop-filter: blur(3px);
		background: rgba(0, 0, 0, 0.25);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100vh;
		width: 100%;
		box-sizing: border-box;
		padding: 1rem;
	}

	.inner {
		width: 100%;
		height: 100%;
		background: var(--bg);
		display: flex;
		flex-direction: row;
		border-radius: 0.5rem;
		overflow: hidden;
	}

	.navbar {
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

		& a {
			all: unset;
			cursor: pointer;
			width: 150px;
			padding: 5px 10px;
			box-sizing: border-box;
			border-radius: 3px;
			margin-bottom: 2px;
			text-align: left;

			&:hover {
				background: var(--accent50);
			}
		}
	}

	.content {
		width: 100%;
		height: 100%;
	}

	.contentInner {
		width: 100%;
		height: 100%;
		overflow-x: auto;
	}

	.top {
		height: 100%;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: start;
	}

	h6 {
		font-weight: 600;
		margin: 5px 0px;
		font-size: 0.8rem;
	}

	.closeIcon {
		all: unset;
		position: absolute;
		top: 1rem;
		padding: 0.5rem;
		right: 1rem;
		transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.5s;
		cursor: pointer;

		&:hover {
			transform: rotate(15deg);
		}
	}
</style>
