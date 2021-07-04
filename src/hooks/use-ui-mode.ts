import {useEffect, useState} from 'preact/hooks';
import {AppStorage} from '../pub-sub/app-storage';

export type UiMode = 'light' | 'dark';

const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

export function useUiMode(): UiMode {
  const colorScheme = AppStorage.singleton.useColorScheme();
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
