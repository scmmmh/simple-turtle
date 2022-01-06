import { writable } from 'svelte/store';

export const commandHistory = writable([] as Command[]);
export const activeCommand = writable(null as Command);
