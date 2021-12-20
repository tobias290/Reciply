<script>
    import SignUp from "./SignUp.svelte";

</script>

<header class="header">
    <h1 class="app-title">Reciply</h1>
</header>
<main>
    <SignUp />
</main>


<style lang="scss">
	@import "../css/bootstrap";

	* {
		font-family: $font-primary;
	}

    :global(body) {
        @include flex($direction: column);

        background: $color-primary;
    }

    .header {
        @include flex($center: true);

        box-sizing: border-box;
        height: 190px;
        padding-bottom: 30px;
    }

    .app-title {
        color: $color-white;
        font-size: 4.5rem;

        :global(&) {
            font-family: $font-title;
        }
    }

    main {
        background: $color-white;
        border-radius: 16px 16px 0 0;
        box-sizing: border-box;
        flex-grow: 1;
        margin-top: -30px;
        padding: 1rem;
    }
</style>
