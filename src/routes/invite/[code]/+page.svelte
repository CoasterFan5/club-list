<script lang="ts">
	import { enhance } from '$app/forms';
    import Button from '$lib/components/Button.svelte';

    export let data;
</script>

<main>
    <h1>You've been invited to join <span class="accent">{data.org.name}</span></h1>
    <div class="options">
        <div class="button">
            <form method="POST" action="?/join" use:enhance>
                <Button value="Join" />
            </form>
        </div>
        <span>or</span>
        <div class="button">
            <Button href="/dashboard" value="Go Home" />
        </div>
    </div>
</main>

<style lang="scss">
    .button {
        width: 10rem;
    }

    .options {
        display: flex;
        flex-direction: row;
        gap: 0.5rem;
        align-items: center;
    }

    .accent {
        color: var(--accent);
    }

    main {
        box-sizing: border-box;
        padding: 2rem;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        height: 100vh;
    }
</style>
