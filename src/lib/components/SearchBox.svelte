<script lang="ts" generics="K">
    export let showSelector = false;

	let searchElement: HTMLInputElement;

	let searchPos = {
		x: 0,
		y: 0
	};

	let searchInput = '';

    type Data<T> = [T[], (item: T) => number, (item: T) => string];

    export let data: Data<K>;
    let filteredData: K[];
    $: filteredData = data[0].filter((item) => {
        return data[2](item).toLowerCase().includes(searchInput.toLowerCase());
    });

    export function propagateClick(e: MouseEvent) {
        searchPos = {
            x: e.clientX,
            y: e.clientY
        };
    }
</script>

{#if showSelector}
	<button
		class="clickInterceptor"
		on:click|self={(e) => {
			showSelector = false;
		}}
	/>

    <div
        style="top: {searchPos.y}px; left: {searchPos.x}px"
        class="roleSelector"
    >
        <input bind:this={searchElement} placeholder="Search" bind:value={searchInput} />
        <slot {filteredData} />
    </div>
{/if}

<style lang="scss">
    .roleSelector {
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
	.roleSelector input {
		position: relative;
		all: unset;
		background: rgba(0, 0, 0, 0.1);
		text-align: left;
		cursor: text;
		width: 100%;
		padding: 7px 10px;
		margin-bottom: 5px;
		box-sizing: border-box;
		width: 100%;
		border-radius: 3px;
		transition: all cubic-bezier(0.55, 0.055, 0.675, 0.19) 0.05s;
	}
	
	.clickInterceptor {
		all: unset;
		position: fixed;
		height: 100%;
		width: 100%;
		z-index: 49;
		top: 0px;
		left: 0px;
	}
</style>