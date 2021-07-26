import {Container} from './topic';

export interface BrowserPathnameInit<TValue> {
  readonly replace?: boolean;
  readonly history?: Pick<History, 'pushState' | 'replaceState'>;
  readonly location?: Pick<Location, 'href' | 'pathname'>;
  readonly input: (value: TValue) => string;
  readonly output: (value: string) => TValue;
}

export class BrowserPathname<TValue> implements Container<TValue> {
  readonly #init: BrowserPathnameInit<TValue> &
    Required<Pick<BrowserPathnameInit<TValue>, 'history' | 'location'>>;

  constructor(init: BrowserPathnameInit<TValue>) {
    this.#init = {history, location, ...init};
  }

  get value(): TValue {
    return this.#init.output(this.#init.location.pathname);
  }

  set value(newValue: TValue) {
    const initialHref = this.#init.location.href;
    const url = new URL(initialHref);
    const pathname = this.#init.input(newValue);

    url.pathname = pathname.startsWith('/') ? pathname : '/' + pathname;

    const {href} = url;

    if (href !== initialHref) {
      this.#init.history[this.#init.replace ? 'replaceState' : 'pushState'](
        undefined,
        '',
        href
      );
    }
  }
}
