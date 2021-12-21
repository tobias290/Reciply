<script>
    import { createEventDispatcher } from "svelte";
    import { fly } from "svelte/transition";
    import { getRecipeDetails } from "../business/recipes";

    export let recipe;

    let dispatch = createEventDispatcher();

    const close = () => dispatch("close");
</script>

<div class="recipe" transition:fly="{{ y: document.body.clientHeight, duration: 375, opacity: 1 }}">
    <h1>Active Recipe - {recipe.name}</h1>
    <button on:click={close}>Close</button>
</div>

<style lang="scss">
    @import "../css/bootstrap";

    .recipe {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        background: $color-white;
    }
</style>
