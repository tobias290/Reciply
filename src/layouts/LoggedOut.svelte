<script>
    import SignUp from "../pages/SignUp.svelte";
    import LogIn from "../pages/LogIn.svelte";

    let showSignUp = false;
</script>

{#if showSignUp}
    <SignUp on:showLogIn={() => showSignUp = false} />
{:else}
    <LogIn
        on:showSignUp={() => showSignUp = true}
        on:showForgottenPassword={() => {}}
    />
{/if}
