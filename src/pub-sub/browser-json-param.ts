import {JsonContainer, JsonContainerInit} from './json-container';

export interface BrowserJsonParamInit<TValue>
  extends JsonContainerInit<TValue> {
  readonly key: string;
  readonly method: 'pushState' | 'replaceState';
}

export class BrowserJsonParam<TValue> extends JsonContainer<TValue> {
  readonly #init: BrowserJsonParamInit<TValue>;

  constructor(init: BrowserJsonParamInit<TValue>) {
    super(init);

    this.#init = init;
  }

  protected get text(): string {
    return (
      new URLSearchParams(window.location.search).get(this.#init.key) ?? ''
    );
  }

  protected set text(text: string) {
    const initialHref = window.location.href;
    const url = new URL(initialHref);

    if (text) {
      url.searchParams.set(this.#init.key, text);
    } else {
      url.searchParams.delete(this.#init.key);
    }

    const {href} = url;

    if (href !== initialHref) {
      history[this.#init.method](undefined, '', href);
    }
  }
}
