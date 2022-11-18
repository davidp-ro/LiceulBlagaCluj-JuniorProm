import { writable, type Writable } from 'svelte/store';

export type CurrentPage = 'scan' | 'enterCode';

export const isAuthenticated = writable(false);
export const loggedInUser = writable('');
export const currentPage: Writable<CurrentPage> = writable('scan');
