import {Container} from './topic';

export class BrowserJsonParam<TValue> implements Container<TValue | undefined> {
  constructor(
    readonly key: string,
    readonly historyMethodName: 'pushState' | 'replaceState'
  ) {}

  get value(): TValue | undefined {
    const value = new URLSearchParams(window.location.search).get(this.key);

    return value ? JSON.parse(value) : undefined;
  }

  set value(value: TValue | undefined) {
    const initialHref = window.location.href;
    const url = new URL(initialHref);

    if (value !== undefined) {
      url.searchParams.set(this.key, JSON.stringify(value));
    } else {
      url.searchParams.delete(this.key);
    }

    const {href} = url;

    if (href !== initialHref) {
      history[this.historyMethodName](undefined, '', href);
    }
  }
}
