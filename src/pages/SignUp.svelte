<script>
    import { signUp } from "../business/auth";

    let email = "";
    let password = "";
    let confirmPassword = "";

    function isValid() {
        if (email === "") return false;
        if (password === "") return false;
        if (confirmPassword === "") return false;
        if (password !== confirmPassword) return false;
        return true;
    }

    async function onSignUp(event) {
        if (!isValid()) {
            console.log("Not Valid");
            return;
        }

        const { user, session, error } = await signUp(email, password);

        if (error) {
            console.log(error);
        } else {
            console.log(user, session);
        }
    }
</script>

<div class="sign-up">
    <h1 class="title title--center">Sign Up</h1>

    <form class="form" on:submit|preventDefault={onSignUp}>
        <input
            class="form__input"
            type="text"
            name="email"
            placeholder="Email"
            bind:value={email}
            required
        />
        <input
            class="form__input"
            type="password"
            name="password"
            placeholder="Password"
            bind:value={password}
            required
            autocomplete="new-password"
        />
        <input
            class="form__input"
            type="password"
            name="confirm_password"
            placeholder="Confirm Password"
            bind:value={confirmPassword}
            required
            autocomplete="new-password"
        />

        <input class="form__submit" type="submit" value="Sign Up" />
    </form>

    <div class="options">
        <span>Already have an account? <a>Log In</a></span>
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
        a {
            color: $color-grey;
            cursor: pointer;
            font-weight: bold;
            transition: color .05s linear;

            &:hover {
                color: $color-primary;
                text-decoration: none;
            }
        }
    }
</style>
