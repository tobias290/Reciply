<script>

</script>

<div class="sign-up">
    <h1 class="title title--center">Sign Up</h1>

    <form class="form">
        <input
            class="form__input"
            type="text"
            name="email"
            placeholder="Email"
        />
        <input
            class="form__input"
            type="password"
            name="password"
            placeholder="Password"
        />
        <input
            class="form__input"
            type="password"
            name="confirm_password"
            placeholder="Confirm Password"
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
