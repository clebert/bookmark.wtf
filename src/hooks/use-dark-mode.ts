import {useEffect, useState} from 'preact/hooks';
import {AppTopics} from '../pub-sub/app-topics';

const mediaQuery = window.matchMedia(`(prefers-color-scheme: dark)`);

export function useDarkMode(): boolean {
  const colorScheme = AppTopics.colorScheme.use();
  const [prefersDark, setPrefersDark] = useState(mediaQuery.matches);

  useEffect(() => {
    const listener = () => setPrefersDark(mediaQuery.matches);

    mediaQuery.addEventListener(`change`, listener);

    return () => mediaQuery.removeEventListener(`change`, listener);
  }, []);

  return colorScheme === `dark` || (colorScheme === `auto` && prefersDark);
}
