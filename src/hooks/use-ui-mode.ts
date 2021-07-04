import {useEffect, useState} from 'preact/hooks';
import {JsonStorage} from '../singletons/json-storage';

export type UiMode = 'light' | 'dark';

const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

export function useUiMode(): UiMode {
  const colorScheme = JsonStorage.singleton.use('colorScheme');
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
