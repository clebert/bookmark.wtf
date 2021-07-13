import {Container} from './topic';

export class BrowserPathname implements Container<string> {
  constructor(readonly historyMethodName: 'pushState' | 'replaceState') {}

  get value(): string {
    return window.location.pathname;
  }

  set value(value: string) {
    const initialHref = window.location.href;
    const url = new URL(initialHref);

    url.pathname = value.startsWith('/') ? value : '/' + value;

    const {href} = url;

    if (href !== initialHref) {
      history[this.historyMethodName](undefined, '', href);
    }
  }
}
