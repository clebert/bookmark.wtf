import type {JsonContainerInit} from './json-container';
import {JsonContainer} from './json-container';

export interface BrowserJsonItemInit<TValue> extends JsonContainerInit<TValue> {
  readonly key: string;
  readonly storage?: Pick<Storage, 'getItem' | 'removeItem' | 'setItem'>;
}

export class BrowserJsonItem<TValue> extends JsonContainer<TValue> {
  readonly #init: BrowserJsonItemInit<TValue> &
    Required<Pick<BrowserJsonItemInit<TValue>, 'storage'>>;

  constructor(init: BrowserJsonItemInit<TValue>) {
    super(init);

    this.#init = {storage: localStorage, ...init};
  }

  protected get text(): string {
    return this.#init.storage.getItem(this.#init.key) ?? ``;
  }

  protected set text(text: string) {
    if (text) {
      this.#init.storage.setItem(this.#init.key, text);
    } else {
      this.#init.storage.removeItem(this.#init.key);
    }
  }
}
