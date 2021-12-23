<script>
    import { onMount } from "svelte";
    import { getAllRecipes } from "../business/recipes";
    import Recipe from "../components/Recipe.svelte";
    import Loading from "../components/Loading.svelte";
    import Error from "../components/Error.svelte";

    let recipes, error;

    onMount(async () => {
        ({recipes, error} = await getAllRecipes())
    });
</script>

<h1 class="title">Your Recipes</h1>

{#if recipes && !error }
    <div class="recipes">
        {#each recipes as recipe}
            <Recipe {recipe} on:click />
        {:else}
            <p style="font-size: 1.5rem">No Recipes</p>
        {/each}
    </div>
{:else if error}
    <Error>{error.message}</Error>
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
