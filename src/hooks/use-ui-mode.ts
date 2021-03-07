import {createContext} from 'preact';
import {useLayoutEffect, useMemo, useState} from 'preact/hooks';

export interface UIMode {
  readonly colorSchemeSelection: ColorSchemeSelection;
  readonly colorScheme: ColorScheme;

  changeColorScheme(): void;
}

export type ColorSchemeSelection = ColorScheme | 'auto';
export type ColorScheme = 'light' | 'dark';

export const UIModeContext = createContext<UIMode>(undefined as any);

export function useUIMode(): UIMode {
  const [
    colorSchemeSelection,
    setColorSchemeSelection,
  ] = useState<ColorSchemeSelection>(() => {
    const item = localStorage.getItem('colorSchemeSelection');

    return item === 'light' || item === 'dark' ? item : 'auto';
  });

  const colorScheme = useMemo<ColorScheme>(() => {
    const {matches: prefersDark} = window.matchMedia(
      '(prefers-color-scheme: dark)'
    );

    return colorSchemeSelection === 'dark' ||
      (colorSchemeSelection === 'auto' && prefersDark)
      ? 'dark'
      : 'light';
  }, [colorSchemeSelection]);

  const changeColorScheme = () => {
    if (colorSchemeSelection === 'auto') {
      localStorage.setItem('colorSchemeSelection', 'dark');
      setColorSchemeSelection('dark');
    } else if (colorSchemeSelection === 'dark') {
      localStorage.setItem('colorSchemeSelection', 'light');
      setColorSchemeSelection('light');
    } else {
      localStorage.setItem('colorSchemeSelection', 'auto');
      setColorSchemeSelection('auto');
    }
  };

  useLayoutEffect(() => {
    if (colorScheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [colorScheme]);

  return useMemo(
    () => ({colorSchemeSelection, colorScheme, changeColorScheme}),
    [colorSchemeSelection]
  );
}
