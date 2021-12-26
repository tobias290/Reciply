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

// /**
//  * Gets all the recipes in the weekly plan and create a shopping list.
//  *
//  * @returns {Promise<{shoppingList: null, error: {message: string, details: string, hint: string, code: string}}|{shoppingList: *, error: {message: string, details: string, hint: string, code: string}}|{shoppingList: null, error: *}>}
//  */
// export async function getShoppingList() {
//     let weeklyPlan, checkedIngredients, error;
//
//     ({weeklyPlan, error} = await getWeeklyPlan());
//
//     if (error)
//         return {shoppingList: null, error};
//
//     ({checkedIngredients, error} = await getShoppingListRecipeCheckedIngredients());
//
//     if (error)
//         return {shoppingList: null, error};
//
//     let shoppingList = weeklyPlan.map(plan => plan.recipe);
//
//     shoppingList = {
//         lists: shoppingList,
//         items: 0,
//         checkedItems: 0,
//     }
//
//     // Add the common list
//     let commonIngredientList = {
//         name: "Common",
//         ingredients: [],
//     };
//
//     // Add all the ingredients to the list
//     for (let [i, recipe] of shoppingList.lists.entries()) {
//         let ingredients, error;
//
//         ({ingredients, error} = await getRecipeIngredients(recipe.id));
//
//         // Loop over each item and map whether it is checked or not
//         recipe.ingredients = ingredients.map(ingredient => {
//             let checked = checkedIngredients.find(checked => checked.ingredient_id === ingredient.id);
//
//             if (checked)
//                 shoppingList.checkedItems += 1;
//
//             return {...ingredient, checked};
//         });
//
//         shoppingList.items += recipe.ingredients.length;
//
//         // If this is the first loop we have nothing to check against
//         if (i === 0)
//             continue;
//
//         for (let ingredient of shoppingList.lists.slice(0, i).map(list => list.ingredients).flat()) {
//             // Check each ingredient in all the previously added recipes
//             // If any ingredient is also in the current list add it to the common list
//             if (recipe.ingredients.map(ingredient => ingredient.name).includes(ingredient.name)) {
//                 if (commonIngredientList.ingredients.map(ingredient => ingredient.name).includes(ingredient.name)) {
//                     // Already exists update the quantity
//                     let commonIngredient = commonIngredientList.ingredients.find(commonIngredient => commonIngredient.name === ingredient.name)
//                     commonIngredient.quantity += ingredient.quantity;
//
//                     if (Array.isArray(commonIngredient.id))
//                         commonIngredient.id.push(ingredient.id);
//                     else
//                         commonIngredient.id = [commonIngredient.id, ingredient.id];
//                 } else {
//                     // Doesn't exist add it as a new item
//                     commonIngredientList.ingredients.push(ingredient);
//                 }
//
//                 // Remove any common ingredients the recipe list
//                 recipe.ingredients = recipe.ingredients.filter(localIngredient => localIngredient.name !== ingredient.name);
//             }
//         }
//     }
//
//     shoppingList.lists.unshift(commonIngredientList);
//     shoppingList.lists = shoppingList.lists.filter(list => list.ingredients.length !== 0);
//
//     return {shoppingList, error};
// }

/**
 * Gets all the recipes in the weekly plan and create a shopping list.
 *
 * @returns {Promise<{shoppingList: null, error: {message: string, details: string, hint: string, code: string}}|{shoppingList: *, error: {message: string, details: string, hint: string, code: string}}|{shoppingList: null, error: *}>}
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

    // // Add the common list
    // let commonIngredientList = {
    //     name: "Common",
    //     ingredients: [],
    // };

    let shoppingListRecipeIds = [];

    // Merge duplicate recipes and update there quantity
    for (let recipe of recipes) {
        if (shoppingListRecipeIds.includes(recipe.id)) {
            let index = shoppingList.lists.findIndex(list => list.id === recipe.id);
            let originalRecipe = shoppingList.lists[index];

            originalRecipe.ingredients = originalRecipe.ingredients.map(ingredient =>
                ({...ingredient, quantity: ingredient.quantity + ingredient.quantity})
            );

            if (originalRecipe.hasOwnProperty("quantity"))
                originalRecipe.quantity += 1;
            else
                originalRecipe.quantity = 2;

            shoppingList.lists[index] = originalRecipe;

            continue;
        }

        let ingredients;
        ({ingredients, error} = await getRecipeIngredients(recipe.id));

        recipe.ingredients = ingredients.map(ingredient => {
            let checked = checkedIngredients.find(checked => checked.ingredient_id === ingredient.id);

            if (checked)
                shoppingList.checkedItems += 1;

            return {...ingredient, checked};
        });

        shoppingList.items += recipe.ingredients.length;
        shoppingList.lists.push(recipe);
        shoppingListRecipeIds.push(recipe.id);
    }

    // // Add all the ingredients to the list
    // for (let [i, recipe] of shoppingList.lists.entries()) {
    //     let ingredients, error;
    //
    //     ({ingredients, error} = await getRecipeIngredients(recipe.id));
    //
    //     // Loop over each item and map whether it is checked or not
    //     recipe.ingredients = ingredients.map(ingredient => {
    //         let checked = checkedIngredients.find(checked => checked.ingredient_id === ingredient.id);
    //
    //         if (checked)
    //             shoppingList.checkedItems += 1;
    //
    //         return {...ingredient, checked};
    //     });
    //
    //     shoppingList.items += recipe.ingredients.length;
    //
    //     // If this is the first loop we have nothing to check against
    //     if (i === 0)
    //         continue;
    //
    //     for (let ingredient of shoppingList.lists.slice(0, i).map(list => list.ingredients).flat()) {
    //         // Check each ingredient in all the previously added recipes
    //         // If any ingredient is also in the current list add it to the common list
    //         if (recipe.ingredients.map(ingredient => ingredient.name).includes(ingredient.name)) {
    //             if (commonIngredientList.ingredients.map(ingredient => ingredient.name).includes(ingredient.name)) {
    //                 // Already exists update the quantity
    //                 let commonIngredient = commonIngredientList.ingredients.find(commonIngredient => commonIngredient.name === ingredient.name)
    //                 commonIngredient.quantity += ingredient.quantity;
    //             } else {
    //                 // Doesn't exist add it as a new item
    //                 commonIngredientList.ingredients.push(ingredient);
    //
    //             }
    //
    //             // Remove any common ingredients the recipe list
    //             recipe.ingredients = recipe.ingredients.filter(localIngredient => localIngredient.name !== ingredient.name);
    //         }
    //     }
    // }

    // shoppingList.lists.unshift(commonIngredientList);
    // shoppingList.lists = shoppingList.lists.filter(list => list.ingredients.length !== 0);


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
