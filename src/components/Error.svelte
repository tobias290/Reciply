<div class="error">
    <slot>An error occurred...</slot>
</div>

<style lang="scss">
    @import "../css/bootstrap";

    .error {
        @include absolute-center(60px);

        box-sizing: border-box;
        color: $color-error;
        font-size: 2rem;
        font-weight: 300;
        padding: 1rem;
        text-align: center;
        width: 100%;
    }
</style>
