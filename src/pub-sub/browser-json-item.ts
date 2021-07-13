import {Container} from './topic';

export class BrowserJsonItem<TValue> implements Container<TValue | undefined> {
  constructor(readonly key: string, readonly storage: Storage) {}

  get value(): TValue | undefined {
    const value = this.storage.getItem(this.key);

    return value ? JSON.parse(value) : undefined;
  }

  set value(value: TValue | undefined) {
    if (value !== undefined) {
      this.storage.setItem(this.key, JSON.stringify(value));
    } else {
      this.storage.removeItem(this.key);
    }
  }
}
