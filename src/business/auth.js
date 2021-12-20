import { supabase } from "./supabaseClient";

export async function signUp(email, password) {
    return await supabase.auth.signUp({
        email: email,
        password: password,
    });
}

export async function logIn(email, password) {
    return await supabase.auth.signIn({
        email: email,
        password: password,
    });
}

export async function logOut() {
   return await supabase.auth.signOut()
}
