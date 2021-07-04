import {JSX} from 'preact';
import {useCallback} from 'preact/hooks';
import {BrowserStorage} from '../singletons/browser-storage';
import {Button} from './button';
import {Icon} from './icon';

const titles = {auto: 'System theme', light: 'Day theme', dark: 'Night theme'};
const iconTypes = {auto: 'cog', light: 'sun', dark: 'moon'} as const;

export function ColorSchemeButton(): JSX.Element {
  const colorScheme = BrowserStorage.singleton.use('colorScheme');

  const toggleColorScheme = useCallback(() => {
    if (colorScheme === 'auto') {
      BrowserStorage.singleton.set('colorScheme', 'dark');
    } else if (colorScheme === 'dark') {
      BrowserStorage.singleton.set('colorScheme', 'light');
    } else {
      BrowserStorage.singleton.set('colorScheme', 'auto');
    }
  }, [colorScheme]);

  return (
    <Button
      class="ColorSchemeButton"
      title={titles[colorScheme]}
      onClick={toggleColorScheme}
    >
      <Icon type={iconTypes[colorScheme]} standalone />
    </Button>
  );
}
