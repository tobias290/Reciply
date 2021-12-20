import { supabase } from "./supabaseClient";

export async function signUp(email, password) {
    return await supabase.auth.signUp({
        email: email,
        password: password,
    });
}

export function signIn() {

}

export function signOut() {

}
