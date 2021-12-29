<script>
    import Home from "../pages/Home.svelte";
    import ShoppingList from "../pages/ShoppingList.svelte";
    import WeeklyPlanner from "../pages/WeeklyPlanner.svelte";
    import Settings from "../pages/Settings.svelte";
    import Recipe from "../pages/Recipe.svelte";
    import TabBar from "../components/TabBar.svelte";
    import AddRecipe from "../pages/AddRecipe.svelte";

    let routes = [
        {
            name: "home",
            component: Home
        },
        {
            name: "shopping-list",
            component: ShoppingList
        },
        {
            name: "weekly-planner",
            component: WeeklyPlanner
        },
        {
            name: "settings",
            component: Settings
        },
    ];

    let active = routes[1]; // TODO: Set to 0 for production

    let activeRecipe;
    let addRecipe = true;

    function onTabClick(event) {
        for (let route of routes)
            if (route.name === event.detail)
                active = route;
    }
</script>

<svelte:component
    this={active.component}
    on:click={(recipe) => activeRecipe = recipe.detail}
/>

{#if activeRecipe}
    <Recipe recipe={activeRecipe} on:close={() => activeRecipe = null} />
{/if}

{#if addRecipe}
    <AddRecipe />
{/if}

<TabBar
    active={active.name}
    addRecipe={addRecipe}
    on:tabClick={onTabClick}
    on:addRecipe={() => addRecipe = !addRecipe}
/>

<style lang="scss">
    @import "../css/bootstrap";

    :global(main) {
        padding-bottom: 90px !important;
    }
</style>
