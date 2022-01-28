import type {Container} from './topic';

export interface JsonContainerInit<TValue> {
  readonly input?: (value: TValue) => unknown;
  readonly output: (value: unknown) => TValue;
}

export abstract class JsonContainer<TValue> implements Container<TValue> {
  readonly #init: JsonContainerInit<TValue>;

  constructor(init: JsonContainerInit<TValue>) {
    this.#init = init;
  }

  protected abstract text: string;

  get value(): TValue {
    const {text} = this;

    let value;

    if (text) {
      try {
        value = JSON.parse(text) ?? undefined;
      } catch {}
    }

    return this.#init.output(value);
  }

  set value(newValue: TValue) {
    const value = this.#init.input ? this.#init.input(newValue) : newValue;

    this.text = value != null ? JSON.stringify(value) : ``;
  }
}
