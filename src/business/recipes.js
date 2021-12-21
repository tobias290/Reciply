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
 * Fetches all the details (ingredients, steps) relating to the given recipe (id).
 *
 * @param recipeId - ID of the recipe to fetch related details from.
 *
 * @returns {Promise<unknown>} - Returns promise fetch the data.
 */
export function getRecipeDetails(recipeId) {
    return new Promise(async (resolve, reject) => {
        // TODO
    });
}
