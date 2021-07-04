import {JSX} from 'preact';
import {useCallback} from 'preact/hooks';
import {JsonStorage} from '../singletons/json-storage';
import {Button} from './button';
import {Icon} from './icon';

const titles = {auto: 'System theme', light: 'Day theme', dark: 'Night theme'};
const iconTypes = {auto: 'cog', light: 'sun', dark: 'moon'} as const;

export function ColorSchemeButton(): JSX.Element {
  const colorScheme = JsonStorage.singleton.use('colorScheme');

  const toggleColorScheme = useCallback(() => {
    if (colorScheme === 'auto') {
      JsonStorage.singleton.set('colorScheme', 'dark');
    } else if (colorScheme === 'dark') {
      JsonStorage.singleton.set('colorScheme', 'light');
    } else {
      JsonStorage.singleton.set('colorScheme', 'auto');
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
