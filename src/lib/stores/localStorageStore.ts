import { writable, type Writable } from 'svelte/store';

export const localStorageStore = <T>(key: string, initialValue: T): Writable<T> => {
  let initial: T = initialValue;

	if (typeof window !== 'undefined') {
		const storedValue = localStorage.getItem(key);
		try {
			initial = storedValue ? JSON.parse(storedValue) : initialValue;
		} catch (e) {
			initial = storedValue as unknown as T;
		}
	}

	const store = writable<T>(initial);

	if (typeof window !== 'undefined') {
		store.subscribe(value => {
			if (typeof value === 'string') {
				localStorage.setItem(key, value);
			} else {
				localStorage.setItem(key, JSON.stringify(value));
			}
		});
	}

	return store;
  };