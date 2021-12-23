<script>
    import { onMount } from "svelte";
    import { getWeeklyPlan } from "../business/recipes";
    import Loading from "../components/Loading.svelte";
    import Error from "../components/Error.svelte";
    import Recipe from "../components/Recipe.svelte";

    let days = [
        "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
    ];

    let activeDay = 0;

    let weeklyPlannerLoader;

    onMount(async () => {
        weeklyPlannerLoader = getWeeklyPlan();
    });
</script>

<h1 class="title">Weekly Planner</h1>

<div class="day-picker">
    {#each days as day, i}
        <div
            class="day-picker__day"
            class:day-picker__day--active={activeDay === i}
            on:click={() => activeDay = i}
        >{day}</div>
    {/each}
</div>

{#if weeklyPlannerLoader}
    {#await weeklyPlannerLoader}
        <Loading />
    {:then recipes}
        <div class="recipes">
            {#each recipes.filter(recipe => recipe.day === activeDay) as recipe}
                <Recipe recipe={recipe.recipe} on:showRecipe />
            {/each}

            <div class="add-item">
                <span>Add Recipe</span>
                <span><i class="fas fa-plus"></i></span>
            </div>
        </div>
    {:catch error}
        <Error>{error.message}</Error>
    {/await}
{:else}
    <Loading />
{/if}

<style lang="scss">
    @import "../css/bootstrap";

    .day-picker {
        @include flex($align: center, $justify: flex-start, $gap: 10px);

        background: $color-primary;
        border-radius: 16px;
        box-sizing: border-box;
        height: 50px;
        overflow: auto;
        padding: 10px;
        width: 100%;

        &__day {
            @include flex($center: true);

            border-radius: 25px;
            box-sizing: border-box;
            color: $color-white;
            height: fit-content;
            padding: .25rem .75rem;
            text-align: center;
            transition: background-color .125s linear, color .125s linear;
            width: fit-content;
            position: relative;

            // Padding right for scrolling
            &:last-of-type::after {
                content: "";
                position: absolute;
                display: block;
                right: -10px;
                width: 10px;
                height: 1px;
            }

            &--active {
                background: $color-white;
                color: $color-primary;
            }
        }

        @include media(730px) {
            justify-content: center;
        }
    }

    .recipes {
        @include flex($center: true, $direction: column, $wrap: wrap, $gap: 20px);

        margin: 1.25rem 0;

        @include media(750px) {
            align-items: flex-start;
            flex-direction: row;
            justify-content: flex-start;
        }
    }

    .add-item {
        @include flex($align: center, $justify: space-between);

        background: $color-white-dark;
        border-radius: 8px;
        box-sizing: border-box;
        color: $color-grey;
        font-size: 1.125rem;
        font-weight: bold;
        height: 80px;
        max-width: 350px;
        padding: 1.25rem;
        width: 100%;

        span:last-of-type {
            @include option;
        }
    }
</style>
