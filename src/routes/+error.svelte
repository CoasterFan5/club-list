<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/components/Button.svelte';
</script>

<main>
    {#if $page.error}
        <h1>{$page.status} <span class="bar">|</span> <span class="error">{$page.error.message}</span></h1>
    {/if}

    <div class="small">
        <Button href="/" value="Go Home" />
    </div>
</main>

<style lang="scss">
    h1 {
        font-weight: 400;

        .bar {
            font-weight: 100;
        }

        .error {
            color: var(--accent);
            font-weight: 300;
        }
    }

    main {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
    }

    .small {
        width: 100%;
        max-width: 400px;
        padding: 2rem;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
</style>
