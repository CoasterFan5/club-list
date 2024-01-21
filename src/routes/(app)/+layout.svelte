<script lang="ts">
	import { cubicIn, cubicOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';

	import type { LayoutData } from './$types';
	import Sidebar from './Sidebar.svelte';

	export let data: LayoutData;

	let requiredScreenWidth = 50; //the percent of the screen the user needs to swipe

	let sidebarPos = 75;
	let pageWidth: number;
	let miniSidebar = false;

	let dragX = 0;

	$: miniSidebar = pageWidth <= 500;
	
	$: if(miniSidebar) {
		sidebarPos = 0;
	} else {
		sidebarPos = 75;
	}

	let activeDrag = false;

	const touchMoveHelper = (e: TouchEvent) => {
			if(activeDrag && e.touches.length > 0) {
				console.log(e.touches[0].clientX)
				let tempDragDistance = (e.touches[0].clientX - dragX)/(pageWidth * (requiredScreenWidth/100)) * 75;
				
				let dragDistance = Math.max(0, Math.min(tempDragDistance, 75))
				sidebarPos = dragDistance
			}
	};

	const touchEnd = (e: TouchEvent) => {
		console.log('touch end')
		if(activeDrag) {
			activeDrag = false,
			sidebarPos = Math.round(sidebarPos/75) * 75 //makes it either 75 or 0
			console.log(sidebarPos)
		}
	}

	const mouseUpHelper = (e: MouseEvent) => {
		activeDrag = false;
	}

	const touchDownDragTab = (e: TouchEvent) => {
		if(e.touches[0]) {
			dragX = e.touches[0].clientX - ((sidebarPos / 75) * (pageWidth * (requiredScreenWidth/100)))
			activeDrag = true
		}
	}



	const closeSidebar = (e: MouseEvent) => {
		sidebarPos = 0;
	}

	const duration = 200;
	const delay = duration + 75;
	const y = 5;

	const transitionIn = { easing: cubicOut, y, duration, delay };
	const transitionOut = { easing: cubicIn, y: -y, duration };
</script>

<svelte:window bind:innerWidth={pageWidth} on:touchmove={touchMoveHelper} on:touchend={touchEnd} on:touchstart={touchDownDragTab}/>
<div class="wrap">
	<div class="sidebar" style="left: {sidebarPos - 75}px">
		<Sidebar {data} />

		{#if miniSidebar}
			<button class="dragTab" >
				<hr>
				<hr>
			</button>
		{/if}
	</div>
	
	{#if (sidebarPos == 75 || activeDrag) && miniSidebar}
		<button class="quickClose" on:click={closeSidebar}>
		</button>
	{/if}

	{#key data.pathType}
		<div class="content" in:fade={transitionIn} out:fade={transitionOut}>
			<slot />
		</div>
	{/key}
</div>

<style lang="scss">
	.wrap {
		display: flex;
		flex-direction: row;
		width: 100%;
		height: 100vh;
	}

	.content {
		width: calc(100% - 75px);
		margin-left: 75px;
		display: flex;
		position: absolute;
		align-items: center;
		justify-content: start;
		flex-direction: column;
		height: 100vh;
		overflow: auto;
	}
	.sidebar {
		z-index: 1000;
		position: fixed;
		display: flex;
		flex-direction: row;
		align-items: end;
	}

	.dragTab {
		all: unset;
		height: 75px;
		width: 25px;
		background: var(--bgPure);
		z-index: 1001;
		border-radius: 0px 5px 5px 0px;
		box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.1);
		display: flex;
	}
	.dragTab hr {
		width: 3px;
		border: 0px;
		background: var(--textLow);
		opacity: 0.5;
		border-radius: 3px;
	}

	@media only screen and (max-width: 500px) {
		.content {
			width: 100%;
			margin: 0px;
		}
	}

	.quickClose {
		all: unset;
		position: fixed;
		top: 0px;
		right: 0px;
		width: calc(100%);
		height: 100%;
		z-index: 999;
		
	}
</style>
