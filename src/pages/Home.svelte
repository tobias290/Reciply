<script>
    import { getAllRecipes } from "../business/recipes";
    import Recipe from "../components/Recipe.svelte";

    let loadRecipes = getAllRecipes();
</script>

<h1 class="title">Your Recipes</h1>

{#await loadRecipes}
    <p>...loading</p>
{:then recipes}
    {#each recipes as recipe}
        <Recipe {recipe} />
    {/each}
{:catch error}
    <p style="color: red">{error.message}</p>
{/await}

<style lang="scss">
    @import "../css/bootstrap";
</style>
