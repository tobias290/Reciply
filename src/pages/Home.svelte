<script>
    import { getAllRecipes } from "../business/recipes";
    import Recipe from "../components/Recipe.svelte";
    import Loading from "../components/Loading.svelte";
    import Error from "../components/Error.svelte";

    let loadRecipes = getAllRecipes();
</script>

<h1 class="title">Your Recipes</h1>

{#await loadRecipes}
    <Loading />
{:then recipes}
    <div class="recipes">
        {#each recipes as recipe}
            <Recipe {recipe} />
            <Recipe {recipe} />
            <Recipe {recipe} />
        {/each}
    </div>
{:catch error}
    <Error>{error.message}</Error>
{/await}

<style lang="scss">
    @import "../css/bootstrap";

    .recipes {
        @include flex($center: true, $direction: column, $gap: 20px);
    }
</style>
