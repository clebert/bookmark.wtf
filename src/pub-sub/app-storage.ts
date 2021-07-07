import {Bookmark} from '../utils/parse-bookmark';
import {BrowserStorage} from './browser-storage';

export type ColorScheme = 'auto' | 'light' | 'dark';
export type SortOrder = 'clickCount' | 'timeAsc' | 'timeDesc';

export class AppStorage {
  static readonly singleton = new AppStorage(new BrowserStorage());

  private constructor(readonly browserStorage: BrowserStorage) {}

  useColorScheme(): ColorScheme {
    return this.browserStorage.useItem('colorScheme') ?? 'auto';
  }

  setColorScheme(value: ColorScheme): void {
    this.browserStorage.setItem('colorScheme', value);
  }

  useSortOrder(): SortOrder {
    return this.browserStorage.useItem('sortOrder') ?? 'clickCount';
  }

  setSortOrder(value: SortOrder): void {
    this.browserStorage.setItem('sortOrder', value);
  }

  useToken(): string | undefined {
    return this.browserStorage.useItem('token');
  }

  setToken(value: string | undefined): void {
    this.browserStorage.setItem('token', value);
  }

  useBookmark(): Bookmark | undefined {
    return this.browserStorage.useItem('bookmark');
  }

  setBookmark(bookmark: Bookmark | undefined): void {
    this.browserStorage.setItem('bookmark', bookmark);
  }
}
