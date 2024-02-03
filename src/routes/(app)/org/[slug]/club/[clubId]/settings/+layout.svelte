<script lang="ts">
	import { page } from '$app/stores';
	let baseUrl = `/org/${$page.params.slug}/club/${$page.params.clubId}/settings`;

	export let data;
</script>

<div class="wrap">
	<nav class="navbar">
		<a class="link" class:active={data.pathname === baseUrl} href={baseUrl}>General</a>
		<a class="link" class:active={data.pathname === `${baseUrl}/roles`} href="{baseUrl}/roles"
			>Roles</a
		>
		<a class="link" class:active={data.pathname === `${baseUrl}/members`} href="{baseUrl}/members"
			>Members</a
		>
	</nav>
	<div class="content">
		<div class="contentInner">
			<slot />
		</div>
	</div>
</div>

<style lang="scss">
	.wrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;
	}
	.navbar {
		width: 90%;
		height: 100%;
		text-align: left;
		margin-top: 25px;
		z-index: 1;
		background: var(--bgPure);
		border-radius: 5px;
		box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.1);
		display: flex;
		flex-direction: row;
		align-items: start;
		justify-content: start;
		overflow-y: hidden;
		overflow-x: auto;
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

	.link {
		padding: 10px 15px;

		font-size: 1.15rem;
		color: var(--textColor);
		text-decoration: none;
		transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.5s;

		&:hover {
			background: var(--accent50);
		}

		&.active {
			background: var(--accent50);
			opacity: 0.5;
		}
	}
</style>
