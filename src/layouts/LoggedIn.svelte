<script>
    import Home from "../pages/Home.svelte";
    import ShoppingList from "../pages/ShoppingList.svelte";
    import WeeklyPlanner from "../pages/WeeklyPlanner.svelte";
    import Settings from "../pages/Settings.svelte";
    import Recipe from "../pages/Recipe.svelte";
    import TabBar from "../components/TabBar.svelte";

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

    let active = routes[0];

    let activeRecipe;

    function onTabClick(event) {
        for (let route of routes)
            if (route.name === event.detail)
                active = route;
    }
</script>

<svelte:component
    this={active.component}
    on:showRecipe={(recipe) => activeRecipe = recipe.detail}
/>

{#if activeRecipe}
    <Recipe recipe={activeRecipe} on:close={() => activeRecipe = null} />
{/if}

<TabBar active={active.name} on:tabClick={onTabClick} />

<style lang="scss">
    @import "../css/bootstrap";
</style>
