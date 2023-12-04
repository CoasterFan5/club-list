<script lang="ts">
	import { fly } from 'svelte/transition';
	import { removeToast, type Toast } from './toaster';
	import { quintInOut } from 'svelte/easing';
	import { onMount } from 'svelte';
	import sanitizeHtml from 'sanitize-html';

	export let data: Toast;
	let showTimer = false;

	let close = () => removeToast(data.id);

	if (data.life && data.life > 0) {
		setTimeout(() => {
			console.log('toast expired');
			close();
		}, data.life);
	}

	onMount(() => {
		showTimer = true;
	});

	let typeTitles = {
		warn: 'Warning',
		error: 'Error',
		success: 'Success'
	};
</script>

<div
	style="z-index: {100000 - data.id ?? 0};"
	class="wrap"
	transition:fly={{ duration: 500, x: 500, opacity: 0.5, easing: quintInOut }}
>
	<div
		class="toast"
		class:error={data.type == 'error'}
		class:success={data.type == 'success'}
		class:warn={data.type == 'warn'}
	>
		<h3>{typeTitles[data.type]}</h3>
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		<p>{@html sanitizeHtml(data.message)}</p>
		<button class="close" on:click={close}>
			<img alt="close" src="/icons/x.svg" />
		</button>
		{#if showTimer}
			<div style="animation-duration: {data.life}ms;" class="timer" />
		{/if}
	</div>
</div>

<style lang="scss">
	.wrap {
		position: relative;
		z-index: 11;
		margin-top: 10px;
		transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.25s;
	}

	.error {
		border-left: 5px solid var(--accent);
	}

	.success {
		border-left: 5px solid rgb(47, 255, 57);
	}

	.warn {
		border-left: 5px solid rgb(235, 235, 0);
	}

	.toast {
		padding: 10px 30px;
		background: var(--bgPure);
		overflow: hidden;
		display: flex;
		flex-direction: column;
		align-items: start;
		justify-content: center;
		border-radius: 5px;
		width: 400px;
	}

	h3 {
		margin: 5px 0px;
	}

	p {
		margin: 0px;
	}

	.close {
		all: unset;
		cursor: pointer;
		font-size: 1.2rem;
		position: absolute;
		top: 0px;
		right: 0px;
		padding: 2px;
	}

	.close img {
		width: 30px;
	}

	@keyframes closebar {
		from {
			width: 100%;
		}
		to {
			width: 0%;
		}
	}

	.timer {
		position: absolute;
		bottom: 0px;
		left: 0px;
		width: 0%;
		height: 3px;
		background: var(--mid);
		animation-timing-function: linear;
		animation-name: closebar;
	}
</style>
