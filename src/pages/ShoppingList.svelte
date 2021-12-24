<script>
    import { onMount } from "svelte";
    import { getShoppingList } from "../business/recipes";
    import Loading from "../components/Loading.svelte";
    import Error from "../components/Error.svelte";
    import ProgressBar from "../components/ProgressBar.svelte";

    let shoppingList;
    let error;

    let retractedLists = [];

    onMount(async () => {
        ({shoppingList, error} = await getShoppingList());

        console.log(shoppingList);
    });

    function toggleListView(index) {
        if (retractedLists.includes(index))
            retractedLists.splice(retractedLists.indexOf(index), 1);
        else
            retractedLists.push(index);

        retractedLists = retractedLists;
    }
</script>

<h1 class="title">Shopping List</h1>

{#if shoppingList && !error}
    <ProgressBar progress={50} />

    <form class="shopping-lists form form--inline">
        {#each shoppingList as list, i}
            <fieldset class="list" class:list--retracted={retractedLists.includes(i)}>
                <div class="list__header" on:click={() => toggleListView(i)}>
                    <h2>{list.name}</h2>
                    <span>{list.ingredients.length} items</span>
                </div>
                <div class="list__item-container">
                    {#each list.ingredients as ingredient}
                        <div class="list__item">
                            <label class="form__checkbox">
                                <input type="checkbox" bind:checked={ingredient.checked} />
                                <span class="form__checkbox__check"></span>
                                <span>{ingredient.name}</span>
                            </label>
                            <span>
                                {ingredient.quantity === 0 ? "To Taste" : ingredient.quantity}
                                {#if ingredient.unit}
                                    {ingredient.unit}
                                {/if}
                            </span>
                        </div>
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
            @include flex($align: center, $justify: space-between);

            background: $color-white;
            border-radius: 2px;
            box-sizing: border-box;
            height: 50px;
            padding: .75rem;
            width: 100%;

            & > label {
                flex-grow: 1;
                font-size: 1.25rem;
                height: 100%;

                & > span:first-of-type {
                    margin-top: 2px;
                }
            }

            & > span {
                color: #999;
                font-size: .875rem;
            }
        }
    }
</style>
