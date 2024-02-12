<script lang="ts">
	import { enhance } from '$app/forms';
    import Button from '$lib/components/Button.svelte';

    export let data;
</script>

<main>
    {#if data.isAlreadyMember}
        <h1>You're already a member of <span class="accent">{data.org.name}</span></h1>
        <div class="options">
            <div class="button">
                <Button href="/org/{data.org.id}" value="Go to Org" />
            </div>
            <span>or</span>
            <div class="button">
                <Button href="/dashboard" value="Go Home" />
            </div>
        </div>
    {:else}
        <h1>You've been invited to join <span class="accent">{data.org.name}</span></h1>
        <div class="options">
            <div class="button">
                {#if data.isLoggedIn}
                    <form method="POST" action="/org?/join" use:enhance>
                        <input name="joinCode" hidden value={data.joinCode} />
                        <Button value="Join" />
                    </form>
                {:else}
                    <Button href="/login" value="Login" />
                {/if}
            </div>
            <span>or</span>
            <div class="button">
                <Button href="/dashboard" value="Go Home" />
            </div>
        </div>
    {/if}
</main>

<style lang="scss">
    .button {
        max-width: 10rem;
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
