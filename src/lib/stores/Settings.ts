import { writable } from "svelte/store";

export const effectsVolume = writable<number>(0.1);

export const homeAmbienceVolume = writable<number>(0.2);

export const debug = writable<boolean>(false);