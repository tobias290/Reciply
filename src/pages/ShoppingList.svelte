<script>
    import { onMount } from "svelte";
    import { getShoppingList, checkShoppingListRecipeIngredient } from "../business/recipes";
    import Loading from "../components/Loading.svelte";
    import Error from "../components/Error.svelte";
    import ProgressBar from "../components/ProgressBar.svelte";

    let shoppingList;
    let error;

    let retractedLists = [];

    onMount(async () => {
        ({shoppingList, error} = await getShoppingList());
    });

    function toggleListView(index) {
        if (retractedLists.includes(index))
            retractedLists.splice(retractedLists.indexOf(index), 1);
        else
            retractedLists.push(index);

        retractedLists = retractedLists;
    }

    async function onItemToggle(ingredient) {
        if (ingredient.checked)
            shoppingList.checkedItems += 1;
        else
            shoppingList.checkedItems -= 1;

        shoppingList = shoppingList;

        let error;

        if (Array.isArray(ingredient.id)) {
            for (const id of ingredient.id)
                error = await checkShoppingListRecipeIngredient(id, ingredient.checked);
        } else {
            error = await checkShoppingListRecipeIngredient(ingredient.id, ingredient.checked);
        }

        if (error)
            console.error(error.message);
    }
</script>

<h1 class="title">Shopping List</h1>

{#if shoppingList && !error}
    <div class="progress">
        <div>
            <span>Progress {Math.round(shoppingList.checkedItems / shoppingList.items * 100)}%</span>
            <span>{shoppingList.checkedItems} of {shoppingList.items}</span>
        </div>
        <ProgressBar progress={shoppingList.checkedItems} max={shoppingList.items} />
    </div>

    <form class="shopping-lists form form--inline">
        {#each shoppingList.lists as list, i}
            <fieldset class="list" class:list--retracted={retractedLists.includes(i)}>
                <div class="list__header" on:click={() => toggleListView(i)}>
                    <h2>
                        {list.name}
                        {#if list.quantity}
                            (x{list.quantity})
                        {/if}
                    </h2>
                    <span>{list.ingredients.length} {list.ingredients.length > 1 ? "items" : "item"}</span>
                </div>
                <div class="list__item-container">
                    {#each list.ingredients as ingredient}
                        <label class="form__checkbox list__item">
                            <input type="checkbox" bind:checked={ingredient.checked} on:change={() => onItemToggle(ingredient)} />
                            <span class="form__checkbox__check"></span>
                            <span class="list__item-details">
                                {#if ingredient.checked}
                                    <s>{ingredient.name}</s>
                                {:else}
                                    {ingredient.name}
                                {/if}
                                <span>
                                    {ingredient.quantity === 0 ? "To Taste" : ingredient.quantity}
                                    {#if ingredient.unit}
                                        {ingredient.unit}
                                    {/if}
                                </span>
                            </span>
                        </label>
                    {/each}
                </div>
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

    .progress {
        @include flex($align: center, $direction: column, $gap: 10px);

        margin-bottom: 2rem;

        div {
            @include flex($align: center, $justify: space-between);

            color: #999;
            font-size: .875rem;
            font-weight: 500;
            width: 100%;
        }
    }

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
        padding: .75rem;
        width: 100%;

        &--retracted {
            .list__header {
                margin-bottom: 0;
            }

            .list__item-container {
                display: none;
            }
        }

        &__header {
            @include flex($align: center, $justify: space-between);

            color: $color-grey-light;
            font-size: 1rem;
            font-weight: 600;
            margin-bottom: 1rem;

            h2 {
                font-size: inherit;
                font-weight: inherit;
                margin: 0;
            }

            span {
                font-size: .75rem;
            }
        }

        &__item-container {
            @include flex($align: center, $direction: column, $gap: 10px);
        }

        &__item {
            background: $color-white;
            border-radius: 2px;
            box-sizing: border-box;
            font-size: 1rem;
            font-weight: 500;
            min-height: 50px;
            padding: .75rem .75rem .75rem calc(20px + .5rem + .75rem);
            width: 100%;

            .form__checkbox__check {
                left: .75rem;
                top: 50%;
                transform: translateY(-50%);
            }

            &-details {
                @include flex($align: center, $justify: space-between);

                color: $color-grey;
                height: 26px;

                & > s {
                    opacity: .375;
                }

                & > span {
                    color: #999;
                    font-size: .875rem;
                    text-align: right;
                }
            }
        }
    }
</style>
