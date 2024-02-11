<div class="wrap">
	<div class="inner">
		<h1>Clubsaurus streamlines club management</h1>
		<div class="cards">
			<div class="card">
				<div class="cardInner">
					<div class="title">
						<img src="/icons/shield.svg" alt="shield"/>
						<h3>Roles</h3>
					</div>
					<p>Looking to promote student leadership? Roles allow you to delegate permissions to members of a club, enforcing a student led mentality and reducing the workload of mentors.</p>
				</div>
				
			</div>
			<div class="card">
				<div class="cardInner">
					<div class="title">
						<img src="/icons/announce.svg" alt="megaphone"/>
						<h3>Announcements</h3>
					</div>
					<p>Have something important to say? Announcements are a quick, highly visible way to deliver information.</p>
				</div>
				
			</div>
			<div class="card">
				<div class="cardInner">
					<div class="title">
						<img src="/icons/calendar.svg" alt="calendar"/>
						<h3>Events</h3>
					</div>
					<p>Have an important event or reoccurring meeting? Schedule events and view conflicting events to reduce overlap and ensure maximum availability.</p>
				</div>
				
			</div>

			<div class="card">
				<div class="cardInner">
					<div class="title">
						<img src="/icons/orgs.svg" alt="building"/>
						<h3>Locations*</h3>
					</div>
				</div>
				
			</div>
			<div class="card">
				<div class="cardInner">
					<div class="title">
						<img src="/icons/shield.svg" alt="shield"/>
						<h3>Moderation</h3>
					</div>
				</div>
				
			</div>
			<div class="card">
				<div class="cardInner">
					<div class="title">
						<img src="/icons/crown.svg" alt="crown"/>
						<h3>Administrator Control*</h3>
					</div>
				</div>
				
			</div>
		</div>
		*Coming Soon
	</div>
	
</div>

<style lang="scss">
	.wrap {
		width: 100%;
		padding: 25px 0px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.inner {
		width: 90%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.cards {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		width: 100%;


		.card {
			box-sizing: border-box;
			min-width: 300px;
			padding: 10px;
			width: 33%;
			flex-grow: 1;

			.cardInner {
				width: 100%;
				height: 100%;
				padding: 10px;
				box-sizing: border-box;
				border-radius: 5px;
				background: var(--bgPure);
				display: flex;
				align-items: center;
				justify-content: center;
				flex-direction: column;


				.title {
					display: flex;
					align-items: center;
					justify-content: start;
					flex-direction: row;
					width: 100%;
					margin-bottom: 5px;

					img {
						height: 20px;
						padding: 5px;
						background: var(--accent50);
						margin-right: 10px;
						border-radius: 50%;
					}
					
					h3 {
						font-weight: normal;
						display: flex;
						align-items: center;
						justify-content: center;
						margin: 0px;
						font-size: 1.2rem;
						font-weight: 500;
						
					}
				}
				

				p {
					margin-top: 5px;
				}
			}
		}
	}
	
</style>