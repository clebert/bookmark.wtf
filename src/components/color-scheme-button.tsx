import {JSX, h} from 'preact';
import {useContext} from 'preact/hooks';
import {UIModeContext} from '../hooks/use-ui-mode';
import {Button} from './button';
import {Icon} from './icon';

const titles = {auto: 'System theme', light: 'Day theme', dark: 'Night theme'};
const iconTypes = {auto: 'cog', light: 'sun', dark: 'moon'} as const;

export function ColorSchemeButton(): JSX.Element {
  const {colorSchemeSelection, changeColorScheme} = useContext(UIModeContext);

  return (
    <Button
      class="ColorSchemeButton"
      title={titles[colorSchemeSelection]}
      onClick={changeColorScheme}
    >
      <Icon type={iconTypes[colorSchemeSelection]} standalone />
    </Button>
  );
}
