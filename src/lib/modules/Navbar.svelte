<nav class="wrap">
	<div class="inner">
		<h1>Club List</h1>
		<div class="links">
			<a href="/login">Login</a>
			<a href="/signup">Signup</a>
		</div>
	</div>
</nav>

<style>
	.wrap {
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		background: var(--mid);
	}
	.wrap .inner {
		width: 80%;
		height: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}
	.inner h1 {
		font-size: 2rem;
		color: var(--text);
		margin: 10px;
	}
	.links {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}
	.links a {
		margin-left: 15px;
		font-size: 1.2rem;
		text-decoration: none;
		color: var(--text);
		position: relative;

	}
	.links a::after {
		content: "";
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