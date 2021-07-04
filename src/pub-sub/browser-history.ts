import {Broker} from './broker';

export type BrowserHistoryMethod = 'push' | 'replace';

export class BrowserHistory {
  readonly #pathnameBroker = new Broker();
  readonly #paramBroker = new Broker();

  usePathname(): string {
    return this.#pathnameBroker.use(() => this.getPathname());
  }

  getPathname(): string {
    return window.location.pathname;
  }

  setPathname(method: BrowserHistoryMethod, pathname: string): void {
    const url = new URL(window.location.href);

    url.pathname = pathname;

    if (method === 'push') {
      window.history.pushState(undefined, '', url.href);
    } else {
      window.history.replaceState(undefined, '', url.href);
    }

    this.#pathnameBroker.publish(url.pathname);
  }

  useParam(key: string): string | undefined {
    return this.#paramBroker.use(() => this.getParam(key), {topic: key});
  }

  getParam(key: string): string | undefined {
    const url = new URL(window.location.href);

    return url.searchParams.get(key) || undefined;
  }

  setParam(
    method: BrowserHistoryMethod,
    key: string,
    value: string | undefined
  ): void {
    const url = new URL(window.location.href);

    if (value) {
      url.searchParams.set(key, value);
    } else {
      url.searchParams.delete(key);
    }

    if (method === 'push') {
      window.history.pushState(undefined, '', url.href);
    } else {
      window.history.replaceState(undefined, '', url.href);
    }

    this.#paramBroker.publish(value || undefined, {topic: key});
  }
}
