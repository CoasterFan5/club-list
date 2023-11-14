<script lang="ts">
	import { onMount } from "svelte";
    
    export let name = "Input"
    export let label = "Input"
    export let bgColor = "#ffffff"
    export let customType: "password" | "input" | "email" = "input"
	export let value = ""
    
    let input: HTMLInputElement;
    
    let startFocus = () => {
        input.focus()
    }
    let selectInput = () => {
        moveText = true;
        active = true;
    }
    let deselectText = () => {
        console.log('deselected')
        if(value.length == 0) {
            moveText = false;
        }
        active = false;
    }
    let moveText = false;
    let active = false;

	onMount(() => {
		if(value.length > 0) {
			moveText = true;
		}
	});
</script>



{#if customType == "input"}
<button type="button" style="--bgColor: {bgColor}" class="wrap" class:active on:click={startFocus} tabindex="-1" >
    <input bind:this={input} name="{name}" on:focus={selectInput} on:blur={deselectText} bind:value/>
    <div class="labelBase" class:label1={!moveText} class:labelMoved={moveText}>
        {label}
    </div>
</button>
{:else if customType == "password"}
<button type="button" style="--bgColor: {bgColor}" class="wrap" class:active on:click={startFocus} tabindex="-1" >
    <input bind:this={input} name="{name}" on:focus={selectInput} on:blur={deselectText} bind:value type="password"/>
    <div class="labelBase" class:label1={!moveText} class:labelMoved={moveText}>
        {label}
    </div>
</button>
{:else if customType == "email"}
<button type="button" style="--bgColor: {bgColor}" class="wrap" class:active on:click={startFocus} tabindex="-1" >
    <input bind:this={input} name="{name}" on:focus={selectInput} on:blur={deselectText} bind:value type="email"/>
    <div class="labelBase" class:label1={!moveText} class:labelMoved={moveText}>
        {label}
    </div>
</button>
{/if}

<style>
    .wrap {
        all: unset;
        position: relative;
        width: 100%;
        border-radius: 5px;
        border: 1px solid rgb(190, 190, 190);
        cursor: text;
    }
    input {
        border: 0px;
        outline: 0px;
        box-sizing: border-box;
        padding: 10px;
        font-size: 1.2rem;
        width: 100%;
		background: transparent;
    }
    .labelBase {
        transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.3s;
    }
    .label1 {
        font-size: 1.12rem;
        font-weight: 400;
        box-sizing: border-box;
        padding: 10px;
        top: 0px;
        left: 0px;
        position: absolute;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: start;
		color: rgb(50, 50, 50);
    }
    .labelMoved {
        font-size: 0.8rem;
        position: absolute;
        top: -10px;
        left: 10px;
        background: var(--bgColor);
        padding: 0px 5px;
    }
    .active {
        border: 1px solid var(--primary);
    }
</style>