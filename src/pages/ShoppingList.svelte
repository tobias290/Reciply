<script>
    import { onMount } from "svelte";
    import { getShoppingList } from "../business/recipes";
    import Loading from "../components/Loading.svelte";
    import Error from "../components/Error.svelte";
    import ProgressBar from "../components/ProgressBar.svelte";

    let shoppingList;
    let error;

    onMount(async () => {
        ({shoppingList, error} = await getShoppingList());

        console.log(shoppingList);
    });
</script>

<h1 class="title">Shopping List</h1>

{#if shoppingList && !error}
    <ProgressBar progress={50} />

    <form class="shopping-lists form form--inline">
        {#each shoppingList as list}
            <fieldset class="list">
                {#each list.ingredients as ingredient}
                    <label class="form__checkbox">
                        <input type="checkbox" bind:checked={ingredient.checked} />
                        <span class="form__checkbox__check"></span>
                        <span>{ingredient.name}</span>
                    </label>
                {/each}
            </fieldset>
        {/each}
    </form>
{:else if error}
    <Error>{error.message}</Error>
{:else}
    <Loading />
{/if}

<style lang="scss">
    @import "../css/bootstrap";
    @import "../css/components/forms";

    .shopping-lists {
        @include flex($align: center, $justify: flex-start, $direction: column, $gap: 20px);

        margin: 1.25rem 0;
    }

    .list {
        background: $color-white-dark;
        border: none;
        border-radius: 4px;
        box-sizing: border-box;
        height: fit-content;
        padding: .5rem;
        width: 100%;
    }
</style>
