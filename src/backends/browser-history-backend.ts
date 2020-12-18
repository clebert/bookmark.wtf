import {HistoryBackend} from '../hooks/use-history';

export class BrowserHistoryBackend implements HistoryBackend {
  get url(): string {
    return window.location.href;
  }

  push(url: string): void {
    window.history.pushState(undefined, '', url);
  }

  replace(url: string): void {
    window.history.replaceState(undefined, '', url);
  }
}
