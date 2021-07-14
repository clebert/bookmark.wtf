import {Container} from './topic';

export interface BrowserPathnameInit<TValue> {
  readonly method: 'pushState' | 'replaceState';
  readonly input: (value: TValue) => string;
  readonly output: (value: string) => TValue;
}

export class BrowserPathname<TValue> implements Container<TValue> {
  readonly #init: BrowserPathnameInit<TValue>;

  constructor(init: BrowserPathnameInit<TValue>) {
    this.#init = init;
  }

  get value(): TValue {
    return this.#init.output(window.location.pathname);
  }

  set value(newValue: TValue) {
    const initialHref = window.location.href;
    const url = new URL(initialHref);
    const pathname = this.#init.input(newValue);

    url.pathname = pathname.startsWith('/') ? pathname : '/' + pathname;

    const {href} = url;

    if (href !== initialHref) {
      history[this.#init.method](undefined, '', href);
    }
  }
}
