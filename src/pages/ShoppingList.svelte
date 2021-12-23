<script>
    import { onMount } from "svelte";
    import { getWeeklyPlan, getShoppingListRecipeCheckedIngredients } from "../business/recipes";
    import Loading from "../components/Loading.svelte";
    import Error from "../components/Error.svelte";

    let weeklyPlannerLoader;
    let checkedIngredientsLoader;
    let error = false;

    onMount(async () => {
        checkedIngredientsLoader = await getShoppingListRecipeCheckedIngredients();
        weeklyPlannerLoader = await getWeeklyPlan();
    });
</script>

<h1 class="title">Shopping List</h1>

{#if weeklyPlannerLoader}
    {#await weeklyPlannerLoader}
        <Loading />
    {:then recipes}

    {:catch error}
        <Error>{error.message}</Error>
    {/await}
{:else}
    <Loading />
{/if}

<style lang="scss">
    @import "../css/bootstrap";

</style>
