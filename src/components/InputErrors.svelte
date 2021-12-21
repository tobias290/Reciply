<script>
    export let errors;
</script>

{#if errors.length > 0}
    <small class="form__error">
        {#each errors as error}
            <span>{error}</span>
        {/each}
    </small>
{/if}

<style lang="scss">
    @import "../css/bootstrap.scss";
    @import "../css/forms.scss";
</style>
