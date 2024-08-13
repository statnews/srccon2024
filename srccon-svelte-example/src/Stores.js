import { writable, derived } from 'svelte/store';

export const selectedFilterID = writable('');
export const selectedSearchField = writable('');
export const selectedSearchCollection = writable('');