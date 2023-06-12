import {Button} from './button.js';
import {Icon} from './icon.js';
import {useStateMachine} from '../hooks/use-state-machine.js';
import {colorSchemeStore} from '../stores/color-scheme-store.js';
import * as React from 'react';

const titles = {auto: `System Theme`, light: `Day Theme`, dark: `Night Theme`};

const iconTypes = {
  auto: `computerDesktop`,
  light: `sun`,
  dark: `moon`,
} as const;

export function ColorSchemeButton(): JSX.Element {
  const colorSchemeSnapshot = useStateMachine(colorSchemeStore);

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
