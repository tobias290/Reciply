<script>
    import { getAllRecipes } from "../business/recipes";
    import Recipe from "../components/Recipe.svelte";

    let loadRecipes = getAllRecipes();
</script>

<h1 class="title">Your Recipes</h1>

{#await loadRecipes}
    <p>...loading</p>
{:then recipes}
    <div class="recipes">
        {#each recipes as recipe}
            <Recipe {recipe} />
        {/each}
    </div>
{:catch error}
    <p style="color: red">{error.message}</p>
{/await}

<style lang="scss">
    @import "../css/bootstrap";

    .recipes {
        @include flex($center: true, $direction: column, $gap: 20px);
    }
</style>
