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

    return !error;
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

export async function getShoppingListRecipeCheckedIngredients() {
    let { data, error, status } = await supabase
        .from("shopping_list_checked_ingredients")
        .select();

    return {checkedIngredients: data, error};
}

export async function getShoppingList() {
    let weeklyPlan, checkedIngredients, error;

    ({weeklyPlan, error} = await getWeeklyPlan());

    if (error)
        return {shoppingList: null, error};

    ({checkedIngredients, error} = await getShoppingListRecipeCheckedIngredients());

    if (error)
        return {shoppingList: null, error};

    let shoppingList = weeklyPlan.map(plan => plan.recipe);

    // Add the common list
    let commonIngredientList = {
        name: "Common",
        ingredients: [],
    };

    // Add all the ingredients to the list
    for (let [i, recipe] of shoppingList.entries()) {
        let ingredients, error;

        ({ingredients, error} = await getRecipeIngredients(recipe.id));

        // Loop over each item and map whether it is checked or not
        recipe.ingredients = ingredients.map(ingredient => {
            let checked = checkedIngredients.find(checked => checked.ingredient_id === ingredient.id);

            return {...ingredient, checked};
        });

        // If this is the first loop we have nothing to check against
        if (i === 0)
            continue;

        for (let ingredient of shoppingList.slice(0, i).map(list => list.ingredients).flat()) {
            // Check each ingredient in all the previously added recipes
            // If any ingredient is also in the current list add it to the common list
            if (recipe.ingredients.map(ingredient => ingredient.name).includes(ingredient.name)) {
                if (commonIngredientList.ingredients.map(ingredient => ingredient.name).includes(ingredient.name)) {
                    // Already exists update the quantity
                    let commonIngredient = commonIngredientList.ingredients.find(commonIngredient => commonIngredient.name === ingredient.name)
                    commonIngredient.quantity += ingredient.quantity;
                } else {
                    // Doesn't exist add it as a new item
                    commonIngredientList.ingredients.push(ingredient);
                }

                // Remove any common ingredients the recipe list
                recipe.ingredients = recipe.ingredients.filter(localIngredient => localIngredient.name !== ingredient.name);
            }
        }
    }

    shoppingList.unshift(commonIngredientList);

    return {shoppingList: shoppingList.filter(list => list.ingredients.length !== 0), error};
}

export async function checkShoppingListRecipeIngredients(ingredientId) {

}
