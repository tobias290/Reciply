<script>
    export let instructions;
</script>

<div class="instructions">
    {#each instructions as instruction}
        <div class="instructions__instruction">
            <h2 class="instructions__instruction-step">STEP {instruction.step}</h2>
            <p class="instructions__instruction-instruction">{instruction.instruction}</p>
        </div>
    {/each}
</div>

<style lang="scss">
    @import "../../css/bootstrap";

    .instructions {
        @include flex($align: flex-start, $justify: flex-start, $direction: column, $gap: 10px);

        &__instruction {
            @include flex($align: flex-start, $justify: flex-start, $direction: column, $gap: 10px);

            &-step {
                color: $color-primary;
                font-size: 1.125rem;
                font-weight: bold;
                letter-spacing: 1px;
                margin: 0;
            }

            &-instruction {
                color: $color-grey;
                font-size: 1.125rem;
                margin: 0;
            }
        }
    }
</style>
