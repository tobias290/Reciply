<script>
    import { createEventDispatcher } from 'svelte';
    import { signUp } from "../business/auth";
    import { user as userStore, session as sessionStore } from "../stores/sessionStore";
    import InputErrors from "../components/InputErrors.svelte";

    const dispatch = createEventDispatcher();

    let email = "";
    let password = "";
    let confirmPassword = "";

    let alertError = "";
    let errors = {
        email: [],
        password: [],
        confirmPassword: [],
    };

    function clearErrors() {
        errors = {
            email: [],
            password: [],
            confirmPassword: [],
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

        if (confirmPassword === "") {
            errors.confirmPassword.push("Confirm password required");
            errorsOccurred = true;
        }

        if (password !== confirmPassword) {
            errors.confirmPassword.push("Passwords do not match");
            errorsOccurred = true;
        }

        return !errorsOccurred;
    }

    async function onSignUp(event) {
        if (!isValid()) {
            alertError = "Please check the form for errors";
            console.log(errors);
            return;
        }

        const { user, session, error } = await signUp(email, password);

        if (error) {
            alertError = error.message;
        } else {
            userStore.set(user);
            sessionStore.set(session);
        }
    }
</script>

<div class="sign-up">
    <h1 class="title title--center">Sign Up</h1>

    {#if alertError}
        <div class="alert alert--error">{alertError}</div>
    {/if}

    <form class="form" on:submit|preventDefault={onSignUp}>
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
        <input
            class="form__input"
            type="password"
            placeholder="Confirm Password"
            bind:value={confirmPassword}
            required
            autocomplete="new-password"
        />
        <InputErrors errors={errors.confirmPassword} />

        <input class="form__submit" type="submit" value="Sign Up" />
    </form>

    <div class="options">
        <span>Already have an account? <a on:click={() => dispatch("showLogIn")}>Log In</a></span>
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
