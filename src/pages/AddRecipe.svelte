<script>
    import { fly } from "svelte/transition";

    let title, image, prepTime, cookTime, serves;
    let ingredients = [];
    let instructions = [];

    let name, quantity, unit, details;

    let instruction;

    let showIngredientForm = false;
    let showInstructionForm = false;

    function addIngredient() {
        if (!showIngredientForm) {
            showIngredientForm = true;
            return;
        }

        ingredients.push({
            name, quantity, unit, details,
        });

        name = null;
        quantity  = null;
        unit  = null;
        details = null;

        showIngredientForm = false;
    }

    function addInstruction() {
        if (!showInstructionForm) {
            showInstructionForm = true;
            return;
        }

        instructions.push({
            step: instruction.length + 1,
            instruction,
        });

        instruction = null;

        showInstructionForm = false;
    }
</script>

<div class="add-recipe-modal" transition:fly={{ y: document.body.clientHeight, duration: 375, opacity: 1 }}>
    <form class="form form--center">
        <input class="recipe-title-input" placeholder="Recipe Title" bind:value={title} />

        <input class="form__button" type="button" value="Add Picture" />

        <fieldset class="reset">
            <h2 class="title title--sub">Details</h2>

            <fieldset class="form__set">
                <input class="form__input" type="text" placeholder="Prep Time (mins)" bind:value={prepTime} />
                <input class="form__input" type="text" placeholder="Cook Time (mins)" bind:value={cookTime} />
            </fieldset>
            <input class="form__input" type="text" placeholder="Serves" bind:value={serves} />
        </fieldset>

        <fieldset class="reset">
            <h2 class="title title--sub">Ingredients</h2>

            <!-- Already Added Ingredients -->
            <div class="ingredients">
                {#each ingredients as ingredient}
                    <div class="ingredients__ingredient">
                        <div>
                            <strong>{ingredient.quantity > 0 ? ingredient.quantity : "To Taste"} {ingredient.unit}</strong>
                            <span>{ingredient.name}</span>
                        </div>
                        <i class="fas fa-times"></i>
                    </div>
                {/each}
            </div>

            <!-- Add Ingredient Form -->
            {#if showIngredientForm}
                <fieldset class="form__set">
                    <input class="form__input" type="text" placeholder="Quantity" bind:value={quantity} />
                    <input class="form__input" type="text" placeholder="Unit" bind:value={unit} />
                </fieldset>

                <input class="form__input" type="text" placeholder="Name" bind:value={name} />
                <input class="form__input" type="text" placeholder="Details" bind:value={details} />
            {/if}

            <input class="form__button" type="button" value="Add Ingredient" on:click={addIngredient} />
        </fieldset>

        <fieldset class="reset">
            <h2 class="title title--sub">Instructions</h2>

            <!-- Already Added Instructions -->

            <!-- Add Instruction Form -->

            {#if showInstructionForm}
                <textarea
                    class="form__textarea"
                    placeholder="Step {instructions.length + 1} instructions..."
                    bind:value={instruction}
                ></textarea>
            {/if}

            <input class="form__button" type="button" value="Add Instruction" on:click={addInstruction} />
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
            color: tint($color-grey, 30%);
        }

        &:hover {
            border-color: shade(#C4C4C4, 10%);
        }

        &:focus {
            border-color: $color-primary;
            outline: none;
        }
    }

    .ingredients {
        @include flex($align: center, $justify: flex-start, $gap: 8px);

        margin-bottom: .5rem;

        &__ingredient {
            @include flex($align: center, $gap: 5px);

            background: $color-white-dark;
            border-radius: 4px;
            box-sizing: border-box;
            color: $color-grey;
            font-size: .75rem;
            height: 25px;
            padding: 5px;
            width: fit-content;

            i {
                margin-left: 5px;
            }
        }
    }
</style>
