import {Button} from './button.js';
import {Icon} from './icon.js';
import {useStore} from '../hooks/use-store.js';
import {colorSchemeStore} from '../stores/color-scheme-store.js';
import * as React from 'react';

const titles = {auto: `System Theme`, light: `Day Theme`, dark: `Night Theme`};

const iconTypes = {
  auto: `computerDesktop`,
  light: `sun`,
  dark: `moon`,
} as const;

export function ColorSchemeButton(): JSX.Element {
  const colorSchemeSnapshot = useStore(colorSchemeStore);

  const toggle = React.useCallback(() => {
    colorSchemeStore.get().actions.toggle();
  }, []);

  return (
    <Button
      className="ColorSchemeButton border-dashed"
      title={titles[colorSchemeSnapshot.state]}
      onClick={toggle}
    >
      <Icon type={iconTypes[colorSchemeSnapshot.state]} standalone />
    </Button>
  );
}
