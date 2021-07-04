import {useEffect, useMemo, useState} from 'preact/hooks';

export type BrowserHistoryMethod = 'push' | 'replace';

export class BrowserHistory {
  readonly #pathnameListeners = new Set<(value: string) => void>();

  readonly #paramListenersByKey = new Map<
    string,
    Set<(value: string | undefined) => void>
  >();

  usePathname(): string {
    const [pathname, setPathname] = useState(this.getPathname());

    useEffect(() => {
      this.#pathnameListeners.add(setPathname);

      return () => this.#pathnameListeners.delete(setPathname);
    }, []);

    return pathname;
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

    for (const listener of this.#pathnameListeners) {
      listener(url.pathname);
    }
  }

  useParam(key: string): string | undefined {
    const [value, setValue] = useState(this.getParam(key));

    useEffect(() => {
      const listeners = this.#paramListenersByKey.get(key) ?? new Set();

      this.#paramListenersByKey.set(key, listeners);
      listeners.add(setValue);

      return () => listeners.delete(setValue);
    }, [key]);

    return useMemo(() => this.getParam(key), [key, value]);
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

    const listeners = this.#paramListenersByKey.get(key);

    if (listeners) {
      for (const listener of listeners) {
        listener(value || undefined);
      }
    }
  }
}
