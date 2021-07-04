import {JSX} from 'preact';
import {useCallback} from 'preact/hooks';
import {AppStorage} from '../singletons/app-storage';
import {Button} from './button';
import {Icon} from './icon';

const titles = {auto: 'System theme', light: 'Day theme', dark: 'Night theme'};
const iconTypes = {auto: 'cog', light: 'sun', dark: 'moon'} as const;

export function ColorSchemeButton(): JSX.Element {
  const colorScheme = AppStorage.singleton.useColorScheme();

  const toggleColorScheme = useCallback(() => {
    if (colorScheme === 'auto') {
      AppStorage.singleton.setColorScheme('dark');
    } else if (colorScheme === 'dark') {
      AppStorage.singleton.setColorScheme('light');
    } else {
      AppStorage.singleton.setColorScheme('auto');
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
