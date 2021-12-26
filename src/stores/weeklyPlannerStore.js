import { writable } from "svelte/store";

export const activeDay = writable(0);
export const weeklyPlan = writable(null);
