<script>
    export let ingredients;
    export let serves;

    const originalServings = serves;

    const decrease = () => {
        if (serves - 1 < 1) {
            return;
        }
        serves--;
    };
    const increase = () => serves++;
    const reset = () => serves = originalServings;
    const servings = (quantity, serves) => Math.round(((quantity / originalServings) * serves) * 100) / 100;
</script>

<div class="servings">
    <button class="servings__decrease" on:click={decrease}><i class="fas fa-minus"></i></button>
    <span>Servings <strong>{serves}</strong></span>
    <button class="servings__increase" on:click={increase}><i class="fas fa-plus"></i></button>
    {#if serves !== originalServings}
        <button class="servings__reset" on:click={reset}><i class="fas fa-redo"></i></button>
    {/if}
</div>

<ul class="ingredients">
    {#each ingredients as ingredient}
        <li class="ingredients__ingredient">
            <span class="ingredients__ingredient-amount">
                {ingredient.quantity === 0 ? "To Taste" : servings(ingredient.quantity, serves)}
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

    .servings {
        @include flex($align: center, $gap: 10px);

        color: $color-grey;
        font-size: 1rem;

        &__decrease, &__increase, &__reset {
            @include flex($center: true);

            $size: 30px;

            border-radius: 30px;
            box-sizing: border-box;
            height: $size;
            margin: 0;
            width: $size;
        }

        &__decrease, &__reset {
            background: $color-white;
            border: 1px solid $color-primary;
            color: $color-primary;
        }

        &__increase {
            background: $color-primary;
            border: none;
            color: $color-white;
        }
    }

    .ingredients {
        @include flex($align: flex-start, $justify: flex-start, $direction: column, $gap: 10px);

        list-style: none;
        padding-left: 0;

        &__ingredient {
            @include flex($align: center, $gap: 10px);

            color: $color-grey;
            font-size: 1rem;
            width: 100%;


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
