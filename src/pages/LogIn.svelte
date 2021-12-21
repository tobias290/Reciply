<script>
    import { createEventDispatcher } from "svelte";
    import { logIn } from "../business/auth";
    import { user as userStore, session as sessionStore } from "../stores/sessionStore";
    import InputErrors from "../components/InputErrors.svelte";

    const dispatch = createEventDispatcher();

    let email = "";
    let password = "";

    let alertError = "";
    let errors = {
        email: [],
        password: [],
    };

    function clearErrors() {
        errors = {
            email: [],
            password: [],
        };
    }

    function isValid() {
        let errorsOccurred = false;

        if (email === "") {
            errors.email.push("Email required");
            errorsOccurred = true;
        }

        if (password === "") {
            errors.password.push("Password required");
            errorsOccurred = true;
        }

        return !errorsOccurred;
    }

    async function onLogIn(event) {
        clearErrors();

        if (!isValid()) {
            alertError = "Please check the form for errors";
            return;
        }

        const { user, session, error } = await logIn(email, password);

        if (error) {
            alertError = error.message;
        } else {
            userStore.set(user);
            sessionStore.set(session);
        }
    }
</script>

<div class="sign-up">
    <h1 class="title title--center">Log In</h1>

    {#if alertError}
        <div class="alert alert--error">{alertError}</div>
    {/if}

    <form class="form" on:submit|preventDefault={onLogIn}>
        <input
            class="form__input"
            type="email"
            placeholder="Email"
            bind:value={email}
            required
        />
        <InputErrors errors={errors.email} />
        <input
            class="form__input"
            type="password"
            placeholder="Password"
            bind:value={password}
            required
            autocomplete="new-password"
        />
        <InputErrors errors={errors.password} />

        <input class="form__submit" type="submit" value="Log In" />
    </form>

    <div class="options">
        <span>Don't have an account? <a on:click={() => dispatch("showSignUp")}>Create Account</a></span>
        <span><a on:click={() => dispatch("showForgottenPassword")}>Forgot Password?</a></span>
    </div>
</div>

<style lang="scss">
    @import "../css/bootstrap.scss";
    @import "../css/forms.scss";

    .sign-up {
        @include flex($align: center, $justify: space-between, $direction: column);

        height: 100%;
    }

    .form {
        @include center;
    }

    .options {
        @include flex($align: center, $direction: column, $gap: 10px);

        a {
            color: $color-grey;
            cursor: pointer;
            font-weight: bold;
            text-align: center;
            transition: color .05s linear;

            &:hover {
                color: $color-primary;
                text-decoration: none;
            }
        }
    }
</style>
