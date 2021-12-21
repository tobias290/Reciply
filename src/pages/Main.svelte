<script>
    import TabBar from "../components/TabBar.svelte";
    import Home from "./Home.svelte";
    import ShoppingList from "./ShoppingList.svelte";
    import WeeklyPlanner from "./WeeklyPlanner.svelte";
    import Settings from "./Settings.svelte";

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

    function onTabClick(event) {
        for (let route of routes)
            if (route.name === event.detail)
                active = route;
    }
</script>

<svelte:component this={active.component} />

<TabBar active={active.name} on:tabClick={onTabClick} />

<style lang="scss">
    @import "../css/bootstrap";
</style>
