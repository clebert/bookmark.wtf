import {useEffect, useState} from 'preact/hooks';
import {AppStorage} from '../pub-sub/app-storage';

const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

export function useDarkMode(): boolean {
  const colorScheme = AppStorage.singleton.useColorScheme();
  const [prefersDark, setPrefersDark] = useState(mediaQuery.matches);

  useEffect(() => {
    const listener = () => setPrefersDark(mediaQuery.matches);

    mediaQuery.addEventListener('change', listener);

    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  return colorScheme === 'dark' || (colorScheme === 'auto' && prefersDark);
}
