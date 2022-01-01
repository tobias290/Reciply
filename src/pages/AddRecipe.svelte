<script>
    import { fly } from "svelte/transition";
</script>

<div class="add-recipe-modal" transition:fly={{ y: document.body.clientHeight, duration: 375, opacity: 1 }}>
    <form class="form">
        <input class="recipe-title-input" placeholder="Recipe Title" />

        <input class="form__button" type="button" value="Add Picture" />

        <fieldset class="reset">
            <h2 class="title title--sub">Details</h2>

            <fieldset class="form__set">
                <input class="form__input" type="text" placeholder="Prep Time (mins)" />
                <input class="form__input" type="text" placeholder="Cook Time (mins)" />
            </fieldset>
            <input class="form__input" type="text" placeholder="Serves" />
        </fieldset>

        <fieldset class="reset">
            <h2 class="title title--sub">Ingredients</h2>

            <!-- Already Added Ingredients -->
            <!-- Add Ingredient Form -->

            <input class="form__button" type="button" value="Add Ingredient" />
        </fieldset>

        <fieldset class="reset">
            <h2 class="title title--sub">Instructions</h2>

            <!-- Already Added Instructions -->
            <!-- Add Instruction Form -->

            <input class="form__button" type="button" value="Add Instruction" />
        </fieldset>

        <input class="form__submit form__submit--green" value="Save Recipe" />
    </form>
</div>

<style lang="scss">
    @import "../css/bootstrap";
    @import "../css/components/forms";

    .add-recipe-modal {
        background: $color-white;
        border-radius: 16px 16px 0 0;
        bottom: 0;
        box-shadow: 0 -4px 16px 0 rgba($color-black, .25);
        box-sizing: border-box;
        height: calc(100% - 20px);
        left: 0;
        overflow: auto;
        padding: 1rem 1rem calc(1rem + 80px) 1rem;
        position: absolute;
        width: 100%;
        z-index: 999;
    }

    .reset {
        all: inherit;
    }

    .recipe-title-input {
        border: none;
        border-bottom: 2px solid #C4C4C4;
        color: $color-grey;
        font-size: 2rem;
        font-weight: 900;
        padding-left: 0;
        transition: border-bottom-color .125s linear;
        width: 100%;

        &::placeholder {
            color: tint($color-grey, 10%);
        }

        &:hover {
            border-color: shade(#C4C4C4, 10%);
        }

        &:focus {
            border-color: $color-primary;
            outline: none;
        }
    }
</style>
