import { supabase } from "./supabaseClient";


/**
 * Gets all the recipes in the database (for the session user).
 *
 * @returns {Promise<unknown>} - Returns promise fetch the data.
 */
export async function getAllRecipes() {
    let { data, error, status } = await supabase
        .from("recipe")
        .select();

    return {recipes: data, error};
}

/**
 * Fetches all the ingredients relating to the given recipe (id).
 *
 * @param {number} recipeId - ID of the recipe.
 *
 * @returns {Promise<unknown>} - Returns promise fetch the data.
 */
export async function getRecipeIngredients(recipeId) {
    let { data, error, status } = await supabase
        .from("ingredient")
        .select()
        .eq("recipe_id", recipeId)
        .order("order");

    return {ingredients: data, error};
}

/**
 * Fetches all the instructions relating to the given recipe (id).
 *
 * @param {number} recipeId - ID of the recipe.
 *
 * @returns {Promise<unknown>} - Returns promise fetch the data.
 */
export async function getRecipeInstructions(recipeId) {
    let { data, error, status } = await supabase
        .from("instruction")
        .select()
        .eq("recipe_id", recipeId)
        .order("step");

    return {instructions: data, error};
}

/**
 * Fetches the weekly planner for the current authenticated user. (with recipes)
 *
 * @returns {Promise<unknown>} - Returns promise fetch the data.
 */
export async function getWeeklyPlan() {
    let { data, error, status } = await supabase
        .from("weekly_planner")
        .select(`
            id, day, recipe_id, user_id,
            recipe (
                id, name, image_url, 
                prep_time, cook_time, serves,
                created_at, updated_at
            )
        `);

    return {weeklyPlan: data, error};
}

/**
 * Adds a recipe to the authenticated user's weekly planner
 *
 * @param {number} recipeId - ID of the recipe to add.
 * @param {number} weekday - Weekday to add the recipe to.
 *
 * @returns {boolean} - Returns true if successes, false if it failed.
 */
export async function addToWeeklyPlan(recipeId, weekday) {
    let { data, error } = await supabase
        .from("weekly_planner")
        .insert([{
            recipe_id: recipeId,
            day: weekday,
            user_id: supabase.auth.user().id,
        }]);

    return error;
}

/**
 * Removes the given recipe to the authenticated user's weekly planner
 *
 * @param {number} weeklyPlannerId - ID of the weekly planner row to delete.
 *
 * @returns {boolean} - Returns true if successes, false if it failed.
 */
export async function removeFromWeeklyPlan(weeklyPlannerId) {
    let { data, error } = await supabase
        .from("weekly_planner")
        .delete()
        .match({id: weeklyPlannerId})

    return !error;
}

/**
 * Gets all the recipes in the weekly plan and create a shopping list.
 *
 * @returns {Promise<{shoppingList: null, error: {}}|{shoppingList: {lists: *[], checkedItems: number, items: number}, error: {}}|{shoppingList: null, error: *}>}
 */
export async function getShoppingList() {
    let weeklyPlan, checkedIngredients, error;

    ({weeklyPlan, error} = await getWeeklyPlan());

    if (error)
        return {shoppingList: null, error};

    ({checkedIngredients, error} = await getShoppingListRecipeCheckedIngredients());

    if (error)
        return {shoppingList: null, error};

    let recipes = weeklyPlan.map(plan => plan.recipe);

    let shoppingList = {
        lists: [],
        items: 0,
        checkedItems: 0,
    }

    let shoppingListRecipeIds = [];

    // Merge duplicate recipes and update there quantity
    for (let recipe of recipes) {
        // If a recipe appears more than once
        if (shoppingListRecipeIds.includes(recipe.id)) {
            let index = shoppingList.lists.findIndex(list => list.id === recipe.id);
            let originalRecipe = shoppingList.lists[index];

            // Update the quantity of the ingredients
            originalRecipe.ingredients = originalRecipe.ingredients.map(ingredient => {
                if (ingredient.hasOwnProperty("originalQuantity"))
                    return {...ingredient, quantity: ingredient.quantity + ingredient.originalQuantity}
                else
                    return {...ingredient, quantity: ingredient.quantity * 2, originalQuantity: ingredient.quantity}
            })

            // As this is a duplicate recipe update how many of them there are
            if (originalRecipe.hasOwnProperty("quantity"))
                originalRecipe.quantity += 1;
            else
                originalRecipe.quantity = 2;

            shoppingList.lists[index] = originalRecipe;

            continue;
        }

        let ingredients;
        ({ingredients, error} = await getRecipeIngredients(recipe.id));

        // Add all the ingredients to the recipe and sort them alphabetically
        recipe.ingredients = ingredients.map(ingredient => {
            let checked = checkedIngredients.find(checked => checked.ingredient_id === ingredient.id);

            if (checked)
                shoppingList.checkedItems += 1;

            return {...ingredient, checked};
        }).sort((a, b) => {
            let nameA = a.name.toLowerCase();
            let nameB = b.name.toLowerCase();

            if (nameA < nameB)
                return -1;
            if (nameA > nameB)
                return 1;
            return 0;
        });

        shoppingList.items += recipe.ingredients.length;
        shoppingList.lists.push(recipe);
        shoppingListRecipeIds.push(recipe.id);
    }

    let alreadyCheckedRecipeIndexes = [];
    let alreadyCheckedIngredientsIndexes = [];
    let alreadyCheckedIngredients = [];
    let alreadyCheckedIngredientNames = [];

    // Store all the originals of ingredients that are duplicated
    let originalDuplicateIngredients = [];

    let commonListIngredientNames = [];

    let commonList = {
        name: "Common",
        ingredients: [],
    }

    // Create a common list and remove the ingredients from their own list
    for (let [i, recipe] of shoppingList.lists.entries()) {
        for (let [k, ingredient] of recipe.ingredients.flat().entries()) {
            if (alreadyCheckedIngredientNames.includes(ingredient.name.toLowerCase())) {
               // This is a duplicate ingredients

                let originalIndex = alreadyCheckedIngredientNames.indexOf(ingredient.name.toLowerCase());
                let originalIngredient = alreadyCheckedIngredients[originalIndex];


                if (commonListIngredientNames.includes(originalIngredient.name.toLowerCase())) {
                    // The common list already includes this ingredient
                    let commonIngredientIndex = commonList.ingredients.indexOf(
                        commonList.ingredients.find(localIngredient => localIngredient.name.toLowerCase() === originalIngredient.name.toLowerCase())
                    );

                    commonList.ingredients[commonIngredientIndex].id.push(ingredient.id);
                    commonList.ingredients[commonIngredientIndex].quantity += ingredient.quantity;
                    shoppingList.items += 1;

                    if (ingredient.checked)
                        shoppingList.checkedItems -= 1;
                } else {
                    // This ingredient isn't in the common list yet
                    commonList.ingredients.push({
                        ...originalIngredient,
                        id: [originalIngredient.id, ingredient.id],
                        quantity: originalIngredient.quantity + ingredient.quantity
                    });

                    if (ingredient.checked)
                        shoppingList.checkedItems -= 1;
                }

                // Remove the ingredient from its own list
                shoppingList.lists[i].ingredients.splice(k, 1);
                shoppingList.items -= 1;

                let originalDuplicateIngredient = {
                    recipeIndex: alreadyCheckedRecipeIndexes[originalIndex],
                    ingredientsIndex: alreadyCheckedIngredientsIndexes[originalIndex]
                };

                // Only add the original once
                if (!originalDuplicateIngredients.find(original =>
                    original.recipeIndex === originalDuplicateIngredient.recipeIndex &&
                    original.ingredientsIndex === originalDuplicateIngredient.ingredientsIndex
                ))
                    originalDuplicateIngredients.push(originalDuplicateIngredient);

                // Add the name of the ingredient in the common list, so we can easily check if an ingredient already exists
                commonListIngredientNames.push(originalIngredient.name.toLowerCase());
            } else {
                // This is a new ingredient so save all the details for later

                alreadyCheckedRecipeIndexes.push(i);
                alreadyCheckedIngredientsIndexes.push(k);
                alreadyCheckedIngredients.push(ingredient);
                alreadyCheckedIngredientNames.push(ingredient.name.toLowerCase());
            }
        }
    }

    // Delete the original ingredient of each ingredient included in the common list
    for (let {recipeIndex, ingredientsIndex} of originalDuplicateIngredients) {
        shoppingList.lists[recipeIndex].ingredients.splice(ingredientsIndex, 1);
        shoppingList.items -= 1;
    }

    // Only return lists that have ingredients
    shoppingList.lists = shoppingList.lists.filter(list => list.ingredients.length !== 0);

    // Add the common list to the start if it has ingredients
    if (commonList.ingredients.length !== 0)
        shoppingList.lists.unshift(commonList);

    return {shoppingList, error};
}

/**
 * Gets all the shopping list ingredients that have been checked off the shopping list.
 *
 * @returns {{checkedIngredients: any[], error: {}}}
 */
export async function getShoppingListRecipeCheckedIngredients() {
    let { data, error, status } = await supabase
        .from("shopping_list_checked_ingredients")
        .select();

    return {checkedIngredients: data, error};
}

/**
 * Checks or unchecks an item off the shopping list.
 *
 * @param {number} ingredientId - ID of the ingredient to update.
 * @param {boolean} checked - Whether the item is being checked or unchecked.
 *
 * @returns {Promise<{message: string, details: string, hint: string, code: string}>}
 */
export async function checkShoppingListRecipeIngredient(ingredientId, checked) {
    let data, error;

    if (checked) {
        ({ data, error } = await supabase
            .from("shopping_list_checked_ingredients")
            .insert([{ ingredient_id: ingredientId }]));
    } else {
        ({ data, error } = await supabase
            .from("shopping_list_checked_ingredients")
            .delete()
            .match({ ingredient_id: ingredientId }));
    }

    return error;
}


export async function saveRecipe(recipe, ingredients, instructions) {
    const sanitizeName = (name) => `${name.split(".")[0].toLowerCase()}_${Date.now()}`;

    let data, error;
    const userId = supabase.auth.user().id;
    const imageName = sanitizeName(recipe.image.name);

    ({ data, error } = await supabase.storage
        .from("recipe-images")
        .upload(`${userId}/${imageName}`, recipe.image));

    if (error)
        return error;

    let signedURL;

    ({ signedURL, error } = await supabase
        .storage
        .from("recipe-images")
        .createSignedUrl(`${userId}/${imageName}`, 3.156e+9)); // Expires in 100 years

    // Create recipe
    ({ data, error } = await supabase
        .from("recipe")
        .insert([{
            name: recipe.title,
            prep_time: recipe.prepTime,
            cook_time: recipe.cookTime,
            serves: recipe.serves,
            image_url: signedURL,
            user_id: userId,
        }]));

    if (error)
        return error;

    let recipeId = data[0].id;

    // Upload ingredients
    for (let [i, ingredient] of ingredients.entries()) {
        ({ data, error } = await supabase
            .from("ingredient")
            .insert([{
                name: ingredient.name,
                quantity: ingredient.quantity,
                order: i + 1,
                unit: ingredient.unit,
                details: ingredient.hasOwnProperty("details") ? ingredient.details : "",
                recipe_id: recipeId,
            }]));

        if (error)
            return error;
    }

    // Upload instructions
    for (let instruction of instructions) {
        ({ data, error } = await supabase
            .from("instruction")
            .insert([{
                step: instruction.step,
                instruction: instruction.instruction,
                recipe_id: recipeId,
            }]));

        if (error)
            return error;
    }

}
