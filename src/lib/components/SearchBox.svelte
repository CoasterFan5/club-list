<script generics="K" lang="ts">
	import { clickOutside } from '$lib/actions/clickOutside';

	export let showSelector = false;
	let searchPos = {
		x: 0,
		y: 0
	};

	let holder: HTMLDivElement;
	let searchBox: HTMLInputElement;
	let searchInput = '';

	type Data<T> = [data: T[], index: (item: T) => number, mapper: (item: T) => string];

	export let data: Data<K>;
	let filteredData: K[];
	$: filteredData = data[0].filter((item) => {
		return data[2](item).toLowerCase().includes(searchInput.toLowerCase());
	});

	function close() {
		holder.hidden = true;
		searchBox.value = '';
	}

	export function propagateClick(e: MouseEvent) {
		searchPos = {
			x: e.clientX,
			y: e.clientY
		};
		holder.hidden = false;
		if (searchBox) {
			searchBox.focus();
		}
	}
</script>

<div
	bind:this={holder}
	style="top: {searchPos.y}px; left: {searchPos.x}px"
	class="selector"
	hidden={!showSelector}
	use:clickOutside={close}
>
	<input bind:this={searchBox} placeholder="Search" bind:value={searchInput} />
	<slot {filteredData} />
</div>

<style lang="scss">
	.selector {
		position: fixed;
		border-radius: 5px;
		box-shadow: 0px 0px 4px 4px rgba(0, 0, 0, 0.15);
		background: var(--bgMid);
		width: 250px;
		max-height: 400px;
		padding: 10px;
		box-sizing: border-box;
		z-index: 50;
	}
	.selector input {
		position: relative;
		all: unset;
		background: rgba(0, 0, 0, 0.1);
		text-align: left;
		cursor: text;
		padding: 7px 10px;
		margin-bottom: 5px;
		box-sizing: border-box;
		width: 100%;
		border-radius: 3px;
		transition: all cubic-bezier(0.55, 0.055, 0.675, 0.19) 0.05s;
	}
</style>
