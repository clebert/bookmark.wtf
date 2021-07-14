import {JsonContainer, JsonContainerInit} from './json-container';

export interface BrowserJsonItemInit<TValue> extends JsonContainerInit<TValue> {
  readonly key: string;
  readonly storage: Storage;
}

export class BrowserJsonItem<TValue> extends JsonContainer<TValue> {
  readonly #init: BrowserJsonItemInit<TValue>;

  constructor(init: BrowserJsonItemInit<TValue>) {
    super(init);

    this.#init = init;
  }

  protected get text(): string {
    return this.#init.storage.getItem(this.#init.key) ?? '';
  }

  protected set text(text: string) {
    if (text) {
      this.#init.storage.setItem(this.#init.key, text);
    } else {
      this.#init.storage.removeItem(this.#init.key);
    }
  }
}
