<script>
    import { onMount } from "svelte";

    export let step;
    export let instruction;

    let container;
    let open = true;

    onMount(() =>{

    });

    function toggle() {
        open = !open;
    }
</script>

<div class="instruction" class:instruction--closed={!open} bind:this={container}  on:click={toggle}>
    <div class="instruction__step">
        <strong>Step {step}</strong>
        <span><i class="fas fa-chevron-up instruction__icon"></i></span>
    </div>
    <div class="instruction__instruction">{instruction}</div>
</div>


<style lang="scss">
    @import "../css/bootstrap";

    .instruction {
        @include flex($align: center, $direction: column);

        background: $color-white-dark;
        border-radius: 8px;
        box-sizing: border-box;
        padding: .75rem;
        min-height: 50px;
        overflow: hidden;

        &--closed {
            max-height: 50px;

            .instruction__icon {
                transform: rotate(180deg);
            }
        }

        &__step {
            @include flex($align: center, $justify: space-between);

            margin-top: 2px;
            width: 100%;

            strong {
                color: $color-grey;
                font-size: 1.125rem;
            }

            span {
                @include option($size: 20px, $font-size: .75rem);

                .instruction__icon {
                    transition: transform .175s linear;
                }
            }
        }

        &__instruction {
            color: $color-grey;
            font-size: .875rem;
            margin-top: 1rem;
        }
    }
</style>
