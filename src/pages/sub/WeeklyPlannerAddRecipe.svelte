<script>
    import { fly } from "svelte/transition";
    import { createEventDispatcher, onMount } from "svelte";
    import { getAllRecipes } from "../../business/recipes";
    import Recipe from "../../components/Recipe.svelte";
    import Loading from "../../components/Loading.svelte";
    import Error from "../../components/Error.svelte";

    export let alreadyAddedRecipes;

    const dispatch = createEventDispatcher();

    let loadRecipes;
    let searchQuery = "";

    onMount(async () => loadRecipes = getAllRecipes());

    const filterRecipes = (recipes, searchQuery) => recipes.filter(recipe =>
        recipe.name.includes(searchQuery) && !alreadyAddedRecipes.includes(recipe.id)
    );
</script>

<div class="add-recipe-modal" transition:fly="{{ y: document.body.clientHeight, duration: 375, opacity: 1 }}">
    <h1 class="title title--center">Add Recipe</h1>

    <button class="close-button" on:click={() => dispatch("close")}><i class="fas fa-times"></i></button>

    <form class="form form--center" on:submit|preventDefault>
        <input
            class="form__input"
            type="search"
            placeholder="Search recipes..."
            bind:value={searchQuery}
        />
    </form>

    {#if loadRecipes}
        {#await loadRecipes}
            <Loading />
        {:then recipes}
            <div class="recipes">
                {#each filterRecipes(recipes, searchQuery) as recipe}
                    <Recipe
                        {recipe}
                        on:click={() => dispatch("add", recipe)}
                        actions={[{ icon: "plus" }]}
                    />
                {:else}
                    <p style="font-size: 1.5rem">No Results</p>
                {/each}
            </div>
        {:catch error}
            <Error>{error.message}</Error>
        {/await}
    {:else}
        <Loading />
    {/if}
</div>

<style lang="scss">
    @import "../../css/bootstrap";
    @import "../../css/components/forms";

    .recipes {
        @include flex($center: true, $direction: column, $wrap: wrap, $gap: 20px);

        margin: 1.25rem 0;

        @include media(750px) {
            align-items: flex-start;
            flex-direction: row;
            justify-content: flex-start;
        }
    }

    .close-button {
        @include flex($center: true);

        background: $color-red;
        border-radius: 8px;
        border: none;
        color: $color-white;
        font-size: 1rem;
        height: 30px;
        position: absolute;
        right: 1rem;
        top: 1rem;
        width: 30px;
    }

    .add-recipe-modal {
        background: $color-white;
        border-radius: 16px 16px 0 0;
        bottom: 0;
        box-shadow: 0 -4px 16px 0 rgba($color-black, .25);
        box-sizing: border-box;
        height: calc(100% - 20px);
        left: 0;
        overflow: auto;
        padding: 1rem;
        position: absolute;
        width: 100%;
        z-index: 1001;
    }
</style>
