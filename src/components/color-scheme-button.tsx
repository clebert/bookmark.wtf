import {Button} from './button.js';
import {Icon} from './icon.js';
import {colorSchemeMachine} from '../machines/color-scheme-machine.js';
import * as React from 'react';

const titles = {
  isSystem: `System Theme`,
  isLight: `Day Theme`,
  isDark: `Night Theme`,
};

const iconTypes = {
  isSystem: `computerDesktop`,
  isLight: `sun`,
  isDark: `moon`,
} as const;

export function ColorSchemeButton(): JSX.Element {
  const colorSchemeSnapshot = React.useSyncExternalStore(colorSchemeMachine.subscribe, () =>
    colorSchemeMachine.get(),
  );

  const toggle = React.useCallback(() => {
    colorSchemeSnapshot.actions.toggle();
  }, [colorSchemeSnapshot]);

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
