import {useEffect, useMemo, useState} from 'preact/hooks';

export type BrowserStorageValue = boolean | number | object | string;

export class BrowserStorage {
  readonly #listenersByKey = new Map<string, Set<(value: any) => void>>();

  useItem<TValue extends BrowserStorageValue>(key: string): TValue | undefined {
    const [value, setValue] = useState(this.getItem<TValue>(key));

    useEffect(() => {
      const listeners = this.#listenersByKey.get(key) ?? new Set();

      this.#listenersByKey.set(key, listeners);
      listeners.add(setValue);

      return () => listeners.delete(setValue);
    }, [key]);

    return useMemo(() => this.getItem<TValue>(key), [key, value]);
  }

  getItem<TValue extends BrowserStorageValue>(key: string): TValue | undefined {
    const valueData = localStorage.getItem(key);

    try {
      return valueData ? JSON.parse(valueData) : undefined;
    } catch {
      localStorage.removeItem(key);

      return undefined;
    }
  }

  setItem<TValue extends BrowserStorageValue>(
    key: string,
    value: TValue | undefined
  ): void {
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
}
