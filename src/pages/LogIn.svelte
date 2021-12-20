<script>
    import { createEventDispatcher } from "svelte";
    import { logIn } from "../business/auth";
    import { user as userStore, session as sessionStore } from "../stores/sessionStore";

    const dispatch = createEventDispatcher();

    let email = "";
    let password = "";

    function isValid() {
        if (email === "") return false;
        if (password === "") return false;
        return true;
    }

    async function onLogIn(event) {
        if (!isValid()) {
            console.log("Not Valid");
            return;
        }

        const { user, session, error } = await logIn(email, password);

        if (error) {
            console.log(error);
        } else {
            userStore.set(user);
            sessionStore.set(session);
        }
    }
</script>

<div class="sign-up">
    <h1 class="title title--center">Log In</h1>

    <form class="form" on:submit|preventDefault={onLogIn}>
        <input
            class="form__input"
            type="text"
            placeholder="Email"
            bind:value={email}
            required
        />
        <input
            class="form__input"
            type="password"
            placeholder="Password"
            bind:value={password}
            required
            autocomplete="new-password"
        />

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
