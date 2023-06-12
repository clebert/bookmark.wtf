import {Button} from './button.js';
import {Icon} from './icon.js';
import {colorScheme} from '../state-machines/color-scheme.js';
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
  const colorSchemeSnapshot = React.useSyncExternalStore(colorScheme.subscribe, () =>
    colorScheme.get(),
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
