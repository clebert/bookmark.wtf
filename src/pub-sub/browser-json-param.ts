import type {JsonContainerInit} from './json-container';
import {JsonContainer} from './json-container';

export interface BrowserJsonParamInit<TValue>
  extends JsonContainerInit<TValue> {
  readonly key: string;
  readonly replace?: boolean;
  readonly history?: Pick<History, 'pushState' | 'replaceState'>;
  readonly location?: Pick<Location, 'href' | 'search'>;
}

export class BrowserJsonParam<TValue> extends JsonContainer<TValue> {
  readonly #init: BrowserJsonParamInit<TValue> &
    Required<Pick<BrowserJsonParamInit<TValue>, 'history' | 'location'>>;

  constructor(init: BrowserJsonParamInit<TValue>) {
    super(init);

    this.#init = {history, location, ...init};
  }

  protected get text(): string {
    return (
      new URLSearchParams(this.#init.location.search).get(this.#init.key) ?? ``
    );
  }

  protected set text(text: string) {
    const initialHref = this.#init.location.href;
    const url = new URL(initialHref);

    if (text) {
      url.searchParams.set(this.#init.key, text);
    } else {
      url.searchParams.delete(this.#init.key);
    }

    const {href} = url;

    if (href !== initialHref) {
      this.#init.history[this.#init.replace ? `replaceState` : `pushState`](
        undefined,
        ``,
        href,
      );
    }
  }
}
