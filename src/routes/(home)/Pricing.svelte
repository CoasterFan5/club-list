<div class="wrap">
	<h2>Pricing</h2>
	<div class="prices">
		<div class="price"> 
			<div class="priceContent">
				<h3>Free Plan</h3>
				<h4>$0/mo</h4>
				<ul>
					<li>
						100 members
					</li>
					<li>
						100 clubs
					</li>
					<li>
						10000 page views
					</li>
					<li>
						Source code
					</li>
					<li>
						Free Support
					</li>
				</ul>
				<a class="getstarted" href="/get-started">
					Get Started
				</a>
			</div>
		</div>
		<div class="price"> 
			<div class="priceContent">
				<h3>Large Plan</h3>
				<h4>also $0/mo</h4>
				<ul>
					<li>
						1,000,000 members
					</li>
					<li>
						1,000,000 clubs
					</li>
					<li>
						1 Billion page views
					</li>
					<li>
						Source code
					</li>
					<li>
						Free Support
					</li>
				</ul>
				<a class="getstarted" href="/get-started">
					Get Started
				</a>
			</div>
		</div>
		<div class="price"> 
			<div class="priceContent specialPrice">
				<h3>MEGA Plan</h3>
				<h4>still $0/mo</h4>
				<ul>
					<li>
						Unlimited members
					</li>
					<li>
						Unlimited clubs
					</li>
					<li>
						Unlimied views
					</li>
					<li>
						Source code
					</li>
					<li>
						Free Support
					</li>
				</ul>
				<a class="getstarted" href="/get-started">
					Get Started
				</a>
			</div>
		</div>
	</div>
</div>


<style>
	.wrap {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		padding: 50px 10px;
	}
	h2 {
		font-weight: 500;
		font-size: 2rem;
		margin: 0px;
		margin-bottom: 25px;

	}
	.prices {
		width: 75%;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}
	.price {
		max-width: 400px;
		width: 100%;
		padding: 0px 20px;
		box-sizing: border-box;
		text-align: center;
	}
	.priceContent {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		background: var(--bgPure);
		border-radius: 5px;
		
	}
	h3 {
		font-weight: 500;
		font-size: 1.5rem;
		margin-bottom: 10px;
	}
	h4 {
		margin-top: 0px;
		margin-bottom: 0px;
		font-size: 2rem;
	}
	ul {
		list-style: circle;
		text-align: left;
		width: 80%;
	}
	li {
		font-size: 1.2rem;
	}
	.getstarted {
		width: 80%;
		margin-bottom: 20px;
		padding: 10px 20px;
		box-sizing: border-box;
		border-radius: 3px;
		font-size: 1.2rem;
		text-decoration: none;
		color: var(--textColor);
		border: 1px solid var(--accent);
		transition: background cubic-bezier(0.075, 0.82, 0.165, 1) 0.5s;
	}
	.getstarted:hover {
		color: var(--bgPure);
		background: var(--accent);
	}
	.specialPrice {
		transform: translateY(-10px);
		box-shadow: 0px 0px 5px 5px var(--accent50);
	}
</style>