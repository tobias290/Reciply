<script>
    import { onMount } from "svelte";
    import { getWeeklyPlan, getShoppingListRecipeCheckedIngredients } from "../business/recipes";
    import { sortShoppingLists } from "../helpers/shoppingList";
    import Loading from "../components/Loading.svelte";
    import Error from "../components/Error.svelte";

    let shoppingList;
    let checkedIngredients;
    let error;

    onMount(async () => {
        let weeklyPlan;
        ({weeklyPlan, error} = await getWeeklyPlan());
        ({checkedIngredients, error} = await getShoppingListRecipeCheckedIngredients());
        shoppingList = sortShoppingLists(weeklyPlan);
    });
</script>

<h1 class="title">Shopping List</h1>

{#if shoppingList && !error}

{:else if error}
    <Error>{error.message}</Error>
{:else}
    <Loading />
{/if}

<style lang="scss">
    @import "../css/bootstrap";

</style>
