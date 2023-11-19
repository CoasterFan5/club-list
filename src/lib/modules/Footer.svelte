<div class="footer">
	<div class="inner">
		<div class="left">
			<h2>Clubsaurus</h2>
		</div>
		<div class="right">
			<a href="https://github.com/CoasterFan5/Clubsaurus">Github</a>
			<a href="https://beta.clubsaur.us">Beta</a>
			<a href="/login">Login</a>
			<a href="/get-started">Signup</a>
		</div>
	</div>
	
	
</div>


<style>
	.footer {
		background: var(--bg);
		border-top: 1px solid var(--accent);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 10px 0px;
	}
	.inner {
		width: 80%;
		display: flex;
		align-items: center;
		flex-direction: row;
	}
	.left {
		width: 50%;
	}
	h2 {
		color: var(--accent);
		font-weight: 500;
		font-size: 2rem;
	}
	.right {
		width: 50%;
		display: flex;
		align-items: end;
		justify-content: center;
		flex-direction: column;
	}
	.right a {
		color: var(--accent);
		text-decoration: none;
		margin: 2px 0px;
		position: relative;
		
	}
	.right a::after {
		content: "";
		position: absolute;
		bottom: 0px;
		width: 100%;
		height: 2px;
		left: 0px;
		background: var(--accent);
		transform: scaleX(0);
		transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.5s;
	}
	.right a:hover::after{
		transform: scale(1);
	}
</style>