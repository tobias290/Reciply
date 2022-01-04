<script>
    import { fly } from "svelte/transition";
    import Instruction from "../components/Instruction.svelte";

    let showImage, imagePreview;

    let title, image, prepTime, cookTime, serves;
    let ingredients = [{name: "Olive Oil", quantity: 2, unit: "tbsp"}];
    let instructions = [{step: 1, instruction: "Sprinkle over the flour and cook for a further 2-3 minutes. Add the garlic and all the vegetables and fry for 1-2 minutes."}];

    let name, quantity, unit, details;

    let instruction;

    let updateIngredientIndex;
    let updateInstructionIndex;

    let showIngredientForm = false;
    let showInstructionForm = false;

    function onImageChange() {
        const file = image.files[0];

        if (file) {
            showImage = true;

            const reader = new FileReader();

            reader.addEventListener("load", () => {
                imagePreview.setAttribute("src", reader.result);
                imagePreview.setAttribute("alt", file.name);
            });
            reader.readAsDataURL(file);

            return;
        }

        showImage = false;
    }

    function addIngredient() {
        if (!showIngredientForm) {
            showIngredientForm = true;
            return;
        }

        let newIngredient = {
            name, quantity: parseInt(quantity), unit: unit ? unit.toLowerCase() : "", details,
        };

        if (updateIngredientIndex === null || updateIngredientIndex === undefined) {
            ingredients.push(newIngredient);
        } else {
            ingredients[updateIngredientIndex] = newIngredient;
            updateIngredientIndex = null;
        }

        ingredients = ingredients;

        name = null;
        quantity  = null;
        unit  = null;
        details = null;

        showIngredientForm = false;
    }

    function updateIngredient(i) {
        updateIngredientIndex = i;

        name = ingredients[i].name;
        quantity  = ingredients[i].quantity;
        unit  = ingredients[i].unit;
        details = ingredients[i].details;

        showIngredientForm = true;
    }

    function removeIngredient(i) {
        ingredients.splice(i, 1);

        ingredients = ingredients;
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

        {#if showImage}
            <img class="image-preview" bind:this={imagePreview} height="150" width="300" />
        {/if}

        <label class="form__file">
            <input type="file" bind:this={image} on:change={onImageChange} />
            {showImage ? "Edit" : "Add"} Image
        </label>

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

            <div class="ingredients">
                {#each ingredients as { name, quantity, unit }, i}
                    <div class="ingredients__ingredient" on:click={() => updateIngredient(i)}>
                        <div>
                            <strong>{quantity > 0 ? quantity : "To Taste"} {unit}</strong>
                            <span>{name}</span>
                        </div>
                        <i class="fas fa-times" on:click|stopPropagation={() => removeIngredient(i)}></i>
                    </div>
                {/each}
            </div>

            {#if showIngredientForm}
                <fieldset class="form__set">
                    <input class="form__input" type="text" placeholder="Quantity" bind:value={quantity} />
                    <input class="form__input" type="text" placeholder="Unit" bind:value={unit} />
                </fieldset>

                <input class="form__input" type="text" placeholder="Name" bind:value={name} />
                <input class="form__input" type="text" placeholder="Details" bind:value={details} />
            {/if}

            <input
                class="form__button"
                type="button"
                value="{updateIngredientIndex != null ? 'Edit' : 'Add'} Ingredient"
                on:click={addIngredient}
            />
        </fieldset>

        <fieldset class="reset">
            <h2 class="title title--sub">Instructions</h2>

            <div class="instructions">
                {#each instructions as instruction}
                    <Instruction {...instruction} />
                {/each}
            </div>


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

    .image-preview {
        @include center;

        border-radius: 8px;
        margin-bottom: 1rem;
        object-fit: cover;
        width: 100%;
    }

    .ingredients {
        @include flex($align: center, $justify: flex-start, $wrap: wrap, $gap: 8px);

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

    .instructions {
        @include flex($direction: column, $gap: 8px);

        margin-bottom: .5rem;
    }
</style>
