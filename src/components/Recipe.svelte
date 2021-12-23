<script>
    import { minutesToFormattedTime } from "../helpers/time";
    import { createEventDispatcher } from "svelte";

    export let recipe;
    export let actions;

    const dispatch = createEventDispatcher();

    let { hours, minutes } = minutesToFormattedTime(recipe.cook_time + recipe.prep_time);
</script>

<div class="recipe" on:click={() => dispatch("click", recipe)}>
    <img class="recipe__image" src="{recipe.image_url}" alt="{recipe.name}" />
    <div class="recipe__footer">
        <div class="recipe__info">
            <h2>{recipe.name}</h2>
            <div>
                {#if hours > 0}
                    <strong>{hours}</strong>
                    <span>{hours > 1 ? 'hrs' : 'hr'}</span>
                {/if}
                {#if minutes > 0}
                    <strong>{minutes}</strong>
                    <span>{minutes > 1 ? 'mins' : 'min'}</span>
                {/if}
                <span>•</span>
                <span>Serves</span>
                <strong>{recipe.serves}</strong>
            </div>
        </div>
        <div class="recipe__options">
            {#if actions}
                {#each actions as action}
                    <div
                        class="recipe__options-option {action.color ? `recipe__options-option--${action.color}` : ''}"
                        on:click|stopPropagation={() => action.action ? action.action(recipe) : null}
                    >
                        <i class="fas fa-{action.icon}"></i>
                    </div>
                {/each}
            {:else}
                <div class="recipe__options-option">
                    <i class="fas fa-arrow-right"></i>
                </div>
            {/if}
        </div>
    </div>
</div>

<style lang="scss">
    @import "../css/bootstrap";

    .recipe {
        @include flex($direction: column);

        border: 8px;
        height: fit-content;
        max-width: 350px;
        width: 100%;

        &__image {
            border-radius: 8px 8px 0 0;
            height: 175px;
            object-fit: cover;
            width: 100%;
        }

        &__footer {
            @include flex($align: center, $justify: space-between);

            background: $color-white-dark;
            border-radius: 0 0 8px 8px;
            box-sizing: border-box;
            height: 80px;
            padding: 1rem;
        }

        &__info {
            @include flex($direction: column, $gap: 8px);

            h2 {
                margin: 0;
            }

            div {
                letter-spacing: -5%;
            }
        }

        &__options {
            @include flex($align: center, $justify: flex-start, $gap: 8px);

            &-option {
                @include option;

                &--green {
                    background: $color-green;
                }

                &--red {
                    background: $color-red;
                }
            }
        }
    }
</style>
