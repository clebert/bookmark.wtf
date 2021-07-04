import {useEffect, useMemo, useState} from 'preact/hooks';

export type Listener<TValue extends Value> = (
  value: TValue | undefined
) => void;

export type Key = 'colorScheme' | 'sortOrder' | 'token';
export type Value = ColorScheme | SortOrder | string;
export type ColorScheme = 'auto' | 'light' | 'dark';
export type SortOrder = 'clickCount' | 'timeAsc' | 'timeDesc';

export class BrowserStorage {
  static readonly singleton = new BrowserStorage();

  readonly #listenersByKey = new Map<Key, Set<Listener<any>>>();

  private constructor() {}

  set(key: 'colorScheme', value: ColorScheme): void;
  set(key: 'sortOrder', value: SortOrder): void;
  set(key: 'token', value: string | undefined): void;
  set<TValue extends Value>(key: Key, value: TValue | undefined): void {
    if (value) {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      localStorage.removeItem(key);
    }

    const listeners = this.#listenersByKey.get(key);

    if (listeners) {
      for (const listener of listeners) {
        listener(value);
      }
    }
  }

  use(key: 'colorScheme'): ColorScheme;
  use(key: 'sortOrder'): SortOrder;
  use(key: 'token'): string | undefined;
  use<TValue extends Value>(key: Key): TValue | undefined {
    const [value, setValue] = useState(this.#get<TValue>(key));

    useEffect(() => this.#subscribe<TValue>(key, setValue), [key]);

    return useMemo(() => {
      const storedValue = this.#get<TValue>(key);

      if (storedValue === undefined) {
        if (key === 'colorScheme') {
          const colorScheme: ColorScheme = 'auto';

          return colorScheme as TValue;
        }

        if (key === 'sortOrder') {
          const sortOrder: SortOrder = 'clickCount';

          return sortOrder as TValue;
        }
      }

      return storedValue;
    }, [key, value]);
  }

  #get<TValue extends Value>(key: Key): TValue | undefined {
    const valueData = localStorage.getItem(key);

    try {
      return valueData ? JSON.parse(valueData) : undefined;
    } catch {
      localStorage.removeItem(key);

      return undefined;
    }
  }

  #subscribe<TValue extends Value>(
    key: Key,
    listener: Listener<TValue>
  ): () => void {
    const listeners = this.#listenersByKey.get(key) ?? new Set();

    this.#listenersByKey.set(key, listeners);
    listeners.add(listener);

    return () => listeners.delete(listener);
  }
}
