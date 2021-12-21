<script>
    import { createEventDispatcher } from "svelte";
    import { fly } from "svelte/transition";
    import { minutesToFormattedTime } from "../helpers/time";
    import { getRecipeDetails } from "../business/recipes";

    export let recipe;

    let dispatch = createEventDispatcher();

    const close = () => dispatch("close");
</script>

<div class="recipe-model" transition:fly="{{ y: document.body.clientHeight, duration: 375, opacity: 1 }}">
    <div class="recipe-header" style="--image: url('{recipe.image_url}')">
        <div class="recipe-header__options">
            <i class="fas fa-chevron-down" on:click={close}></i>
        </div>
        <div class="recipe-header__info">
            <h1 class="recipe-header__info-title">{recipe.name}</h1>
            <div class="recipe-header__info-info">
                <div><i class="fas fa-utensils"></i><span>{minutesToFormattedTime(recipe.prep_time, true)}</span></div>
                <div><i class="fas fa-stopwatch"></i><span>{minutesToFormattedTime(recipe.cook_time, true)}</span></div>
                <div><i class="fas fa-users"></i><span>Serves {recipe.serves}</span></div>
            </div>
        </div>
    </div>
    <div class="recipe">
        <ul>
            {#each Array(100) as _, i}
                <li>{i + 1}</li>
            {/each}
        </ul>
    </div>
</div>

<style lang="scss">
    @import "../css/bootstrap";

    .recipe-model {
        @include flex($direction: column);

        background: $color-white;
        height: 100%;
        left: 0;
        position: absolute;
        top: 0;
        width: 100%;
        z-index: 1001;
        overflow: auto;
    }

    .recipe-header {
        @include flex($align: flex-start, $justify: space-between, $direction: column);

        background: linear-gradient(rgba($color-black, 0.5), rgba($color-black, 0.5)), var(--image) 50%;
        background-size: cover;
        box-sizing: border-box;
        height: calc(175px + 30px);
        margin-bottom: -30px;
        min-height: calc(175px + 30px);
        padding: .75rem .75rem calc(.75rem + 30px) .75rem;
        width: 100%;

        &__options {
            @include flex($align: center, $justify: space-between);

            padding: .25rem;

            & > .fas {
                color: $color-white;
                font-size: 1.5rem;
            }
        }

        &__info {
            color: $color-white;

            &-title {
                font-size: 3rem;
                margin: 0 0 .5rem 0;
            }

            &-info {
                @include flex($align: center, $justify: flex-start, $gap: 8px);

                div {
                    @include flex($align: center, $justify: space-around);

                    background: rgba($color-white, .25);
                    border-radius: 4px;
                    color: $color-white;
                    height: 20px;
                    padding: .25rem .5rem;
                    width: fit-content;

                    .fas {
                        font-size: .875rem;
                    }

                    span {
                        font-size: .75rem;
                        margin-left: .75rem;
                    }
                }
            }
        }
    }

    .recipe {
        background: $color-white;
        border-radius: 16px 16px 0 0;
        flex-grow: 1;
        padding-top: 30px;
    }
</style>
