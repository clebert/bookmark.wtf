import {useEffect, useState} from 'preact/hooks';
import {BrowserStorage} from '../singletons/browser-storage';

export type UiMode = 'light' | 'dark';

const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

export function useUiMode(): UiMode {
  const colorScheme = BrowserStorage.singleton.use('colorScheme');
  const [, rerender] = useState({});

  useEffect(() => {
    const listener = () => rerender({});

    mediaQuery.addEventListener('change', listener);

    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  return colorScheme === 'dark' ||
    (colorScheme === 'auto' && mediaQuery.matches)
    ? 'dark'
    : 'light';
}
