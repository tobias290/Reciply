import { supabase } from "./supabaseClient";

export function getAllRecipes(withRelations = false) {
    return new Promise(async (resolve, reject) => {
        let { data, error, status } = await supabase
            .from("recipe")
            .select();

        if (error)
            return reject(error);

        resolve(data);
    });
}
