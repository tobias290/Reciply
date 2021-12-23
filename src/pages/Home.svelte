<script>
    import { onMount } from "svelte";
    import { getAllRecipes } from "../business/recipes";
    import Recipe from "../components/Recipe.svelte";
    import Loading from "../components/Loading.svelte";
    import Error from "../components/Error.svelte";

    let loadRecipes;

    onMount(async () => loadRecipes = getAllRecipes());
</script>

<h1 class="title">Your Recipes</h1>

{#if loadRecipes}
    {#await loadRecipes}
        <Loading />
    {:then recipes}
        <div class="recipes">
            {#each recipes as recipe}
                <Recipe {recipe} on:click />
            {/each}
        </div>
    {:catch error}
        <Error>{error.message}</Error>
    {/await}
{:else}
    <Loading />
{/if}

<style lang="scss">
    @import "../css/bootstrap";

    .recipes {
        @include flex($center: true, $direction: column, $wrap: wrap, $gap: 20px);

        @include media(750px) {
            align-items: flex-start;
            flex-direction: row;
            justify-content: flex-start;
        }
    }
</style>
