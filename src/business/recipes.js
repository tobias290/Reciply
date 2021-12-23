import { supabase } from "./supabaseClient";


/**
 * Gets all the recipes in the database (for the session user).
 *
 * @returns {Promise<unknown>} - Returns promise fetch the data.
 */
export function getAllRecipes() {
    return new Promise(async (resolve, reject) => {
        let { data, error, status } = await supabase
            .from("recipe")
            .select();

        if (error)
            return reject(error);

        resolve(data);
    });
}

/**
 * Fetches all the ingredients relating to the given recipe (id).
 *
 * @param {number} recipeId - ID of the recipe.
 *
 * @returns {Promise<unknown>} - Returns promise fetch the data.
 */
export function getRecipeIngredients(recipeId) {
    return new Promise(async (resolve, reject) => {
        let { data, error, status } = await supabase
            .from("ingredient")
            .select()
            .eq("recipe_id", recipeId)
            .order("order");

        if (error)
            return reject(error);

        resolve(data);
    });
}

/**
 * Fetches all the instructions relating to the given recipe (id).
 *
 * @param {number} recipeId - ID of the recipe.
 *
 * @returns {Promise<unknown>} - Returns promise fetch the data.
 */
export function getRecipeInstructions(recipeId) {
    return new Promise(async (resolve, reject) => {
        let { data, error, status } = await supabase
            .from("instruction")
            .select()
            .eq("recipe_id", recipeId)
            .order("step");

        if (error)
            return reject(error);

        resolve(data);
    });
}

/**
 * Fetches the weekly planner for the current authenticated user. (with recipes)
 *
 * @returns {Promise<unknown>} - Returns promise fetch the data.
 */
export function getWeeklyPlan() {
    return new Promise(async (resolve, reject) => {
        let { data, error, status } = await supabase
            .from("weekly_planner")
            .select(`
                id, day, recipe_id, user_id,
                recipe (
                    id, name, image_url, 
                    prep_time, cook_time, serves,
                    created_at, updated_at
                )
            `)

        if (error)
            return reject(error);

        console.log(data);

        resolve(data);
    });
}

export function addToWeeklyPlan(recipeId, weekday) {

}
