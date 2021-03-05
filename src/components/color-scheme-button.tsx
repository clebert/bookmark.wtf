import {JSX, h} from 'preact';
import {useContext} from 'preact/hooks';
import {UIModeContext} from '../hooks/use-ui-mode';
import {Button} from './button';
import {Icon} from './icon';

export function ColorSchemeButton(): JSX.Element {
  const {colorSchemeSelection, changeColorScheme} = useContext(UIModeContext);

  return (
    <Button onClick={changeColorScheme}>
      <Icon
        type={
          colorSchemeSelection === 'auto'
            ? 'clock'
            : colorSchemeSelection === 'light'
            ? 'sun'
            : 'moon'
        }
        standalone
      />
    </Button>
  );
}
