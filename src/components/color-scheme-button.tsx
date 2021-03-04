import {JSX, h} from 'preact';
import {useCallback, useLayoutEffect, useState} from 'preact/hooks';
import {Button} from './button';
import {Icon} from './icon';

export function ColorSchemeButton(): JSX.Element {
  const [colorScheme, setColorScheme] = useState<'light' | 'dark' | 'auto'>(
    () => {
      const item = localStorage.getItem('colorScheme');

      return item === 'light' || item === 'dark' ? item : 'auto';
    }
  );

  const changeColorScheme = useCallback(() => {
    if (colorScheme === 'auto') {
      localStorage.setItem('colorScheme', 'dark');
      setColorScheme('dark');
    } else if (colorScheme === 'dark') {
      localStorage.setItem('colorScheme', 'light');
      setColorScheme('light');
    } else if (colorScheme === 'light') {
      localStorage.setItem('colorScheme', 'auto');
      setColorScheme('auto');
    }
  }, [colorScheme]);

  useLayoutEffect(() => {
    const {matches: prefersDark} = window.matchMedia(
      '(prefers-color-scheme: dark)'
    );

    if (colorScheme === 'dark' || (colorScheme === 'auto' && prefersDark)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [colorScheme]);

  return (
    <Button onClick={changeColorScheme}>
      <Icon
        type={
          colorScheme === 'auto'
            ? 'lightBulb'
            : colorScheme === 'light'
            ? 'sun'
            : 'moon'
        }
        standalone
      />
    </Button>
  );
}
