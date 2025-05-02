import { writable, type Writable } from 'svelte/store';

export const localStorageStore = <T>(key: string, initialValue: T): Writable<T> => {
  let initial: T = initialValue;

	if (typeof window !== 'undefined') {
		const storedValue = localStorage.getItem(key);
		initial = storedValue ? JSON.parse(storedValue) : initialValue;
	}

	const store = writable<T>(initial);

	if (typeof window !== 'undefined') {
		store.subscribe(value => {
			localStorage.setItem(key, JSON.stringify(value));
		});
	}

	return store;
  };