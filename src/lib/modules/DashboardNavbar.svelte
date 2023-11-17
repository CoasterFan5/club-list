<nav class="navBar">
	<div class="innerWrap">
		<h1>
			<a href="/">Home</a>
		</h1>
		<div class="links">
			<a href="/dashboard">Organizations</a>
			<a href="/dashboard/clubs">Clubs</a>
			<a href="/dashboard/profile">Profile</a>
		</div>
	</div>
</nav>

<style>
	.navBar {
		width: 100%;
		position: sticky;
		top: 0px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		background: var(--mid);
		z-index: 100;
	}
	.innerWrap {
		width: 80%;
		height: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	.navBar h1 {
		font-size: 2rem;
		color: var(--text);
		margin: 10px;
		font-weight: 500;
		text-decoration: none;
	}
	.navBar h1 a {
		text-decoration: none;
		color: var(--text);
	}
	.links {
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: end;
		justify-content: end;
	}
	.links a {
		margin-left: 25px;
		font-size: 1.2rem;
		text-decoration: none;
		color: var(--text);
		position: relative;
	}
	.links a::after {
		content: '';
		position: absolute;
		bottom: 0px;
		left: 0;
		width: 100%;
		height: 2px;
		background: var(--accent);
		transform: scaleX(0);
		transform-origin: center;
		transition: transform 0.3s ease-in-out;
	}
	.links a:hover::after {
		transform: scaleX(1);
	}
</style>
