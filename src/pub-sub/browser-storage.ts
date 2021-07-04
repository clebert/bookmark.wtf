import {Broker} from './broker';

export type BrowserStorageValue = boolean | number | object | string;

export class BrowserStorage {
  readonly #broker = new Broker();

  useItem<TValue extends BrowserStorageValue>(key: string): TValue | undefined {
    return this.#broker.use(key, () => this.getItem(key));
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

    this.#broker.publish(key, value || undefined);
  }
}
