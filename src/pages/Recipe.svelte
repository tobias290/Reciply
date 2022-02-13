<script>
    import { createEventDispatcher, onMount } from "svelte";
    import { fly } from "svelte/transition";
    import { minutesToFormattedTime } from "../helpers/time";
    import { getRecipeIngredients, getRecipeInstructions } from "../business/recipes";
    import Loading from "../components/Loading.svelte";
    import Error from "../components/Error.svelte";
    import RecipeIngredients from "./sub/RecipeIngredients.svelte";
    import RecipeInstructions from "./sub/RecipeInstructions.svelte";
    import Switch from "../components/Switch.svelte";

    export let recipe;

    let ingredients, instructions;
    let ingredientsPage = true;
    let error;

    onMount(async () => {
        ({ingredients, error} = await getRecipeIngredients(recipe.id));
        ({instructions, error} = await getRecipeInstructions(recipe.id));
    });

    let dispatch = createEventDispatcher();

    const toggle = () => ingredientsPage = !ingredientsPage;
    const close = () => dispatch("close");
    const edit = () => dispatch("edit", recipe);
    const del = () => dispatch("delete");
</script>

<div class="recipe-model" transition:fly={{ y: document.body.clientHeight, duration: 375, opacity: 1 }}>
    <div class="recipe-header" style="--image: url('{recipe.image_url}')">
        <div class="recipe-header__options">
            <i class="fas fa-chevron-down" on:click={close}></i>

            <div>
                <div class="recipe-header__options-edit" on:click={edit}><i class="fas fa-edit"></i></div>
                <div class="recipe-header__options-delete" on:click={del}><i class="fas fa-trash-alt"></i></div>
            </div>
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
        <Switch on:toggle={(toggle) => ingredientsPage = toggle.detail}>
            <span slot="left">Ingredients</span>
            <span slot="right">Instructions</span>
        </Switch>

        {#if ingredientsPage}
            {#if ingredients && !error}
                <RecipeIngredients {ingredients} serves={recipe.serves} />
            {:else if error }
                <Error>{error.message}</Error>
            {:else}
                <Loading />
            {/if}
        {:else}
            {#if instructions && !error}
                <RecipeInstructions {instructions} />
            {:else if error }
                <Error>{error.message}</Error>
            {:else}
                <Loading />
            {/if}
        {/if}
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
        margin-bottom: -30px;
        min-height: clamp(calc(175px + 30px), calc(30% + 30px), calc(500px + 30px));
        padding: .75rem .75rem calc(.75rem + 30px) .75rem;
        width: 100%;

        &__options {
            @include flex($align: center, $justify: space-between);

            padding: .25rem;
            width: 100%;

            & > .fas {
                color: $color-white;
                font-size: 1.5rem;
            }

            & > div {
                @include flex($gap: 10px);
            }

            &-edit {
                @include option($color-green, $font-size: .75rem);
            }

            &-delete {
                @include option($color-red, $font-size: .75rem);
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

    :global(.switch) {
        margin-bottom: 1.2rem;
    }

    .recipe {
        background: $color-white;
        border-radius: 16px 16px 0 0;
        flex-grow: 1;
        padding: 1rem;
    }
</style>
