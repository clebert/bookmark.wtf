import {useMemo} from 'preact/hooks';
import {BrowserHistory} from './browser-history';

export class AppHistory {
  static readonly singleton = new AppHistory(new BrowserHistory());

  constructor(readonly browserHistory: BrowserHistory) {}

  useGistName(): string | undefined {
    const pathname = this.browserHistory.usePathname();

    return useMemo(() => pathname.split('/')[1], [pathname]);
  }

  pushGistName(gistName: string | undefined = ''): void {
    this.browserHistory.setPathname('push', '/' + gistName);
  }

  useSearch(): string {
    return this.browserHistory.useParam('search') ?? '';
  }

  replaceSearch(value: string): void {
    this.browserHistory.setParam('replace', 'search', value);
  }
}
