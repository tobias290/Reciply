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

<ProgressBar progress={progress} />

{#if shoppingList && !error}
    {#each shoppingList as list}

    {/each}
{:else if error}
    <Error>{error.message}</Error>
{:else}
    <Loading />
{/if}

<style lang="scss">
    @import "../css/bootstrap";

</style>
