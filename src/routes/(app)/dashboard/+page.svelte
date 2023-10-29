

<script lang="ts">
	import type { PageData } from "./$types";
	import type OrgUser from "@prisma/client";
	export let data: PageData;
</script>

{#if data.user.orgUsers.length < 1}
	<div class="noOrgs">
		<h1>No Joined Organizations</h1>
		<p><button class="textButton">Join</button> or <button class="textButton">Create</button> one!</p>
	</div>
	
{/if}


{#each data.user.orgUsers as orgUser}
	<a href="/org/{orgUser.organization.id}">{orgUser.organization.name}</a>
{/each}

<style>
	.noOrgs {
		text-align: center;
		font-size: 1.2rem;

	}
	.noOrgs h1 {
		margin: 0px;
		
	}
	.noOrgs p {
		margin-top: 10px;
		font-size: 1.5rem;
	
	}
	.textButton {
		all: unset;
		cursor: pointer;
		text-decoration: none;
		color: var(--accent);
		position: relative;
	}
	.textButton::after {
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
	.textButton:hover::after {
		transform: scaleX(1);
	}
</style>