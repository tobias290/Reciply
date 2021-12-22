<script>
    export let ingredients;
</script>

<ul class="ingredients">
    {#each ingredients as ingredient}
        <li class="ingredients__ingredient">
            <span class="ingredients__ingredient-amount">
                {ingredient.quantity === 0 ? "To Taste" : ingredient.quantity}
                {#if ingredient.unit}
                    {ingredient.unit}
                {/if}
            </span>
            {ingredient.name}
        </li>
    {/each}
</ul>

<style lang="scss">
    @import "../../css/bootstrap";

    .ingredients {
        @include flex($align: flex-start, $justify: flex-start, $direction: column, $gap: 10px);

        list-style: none;
        padding-left: 0;

        &__ingredient {
            @include flex($align: center, $gap: 10px);

            color: $color-grey;
            font-size: 1rem;

            &-amount {
                @include flex($center: true);

                background: $color-primary;
                border-radius: 16px;
                color: $color-white;
                font-weight: bold;
                height: 30px;
                min-width: 80px;
                width: 80px;
            }
        }
    }
</style>
