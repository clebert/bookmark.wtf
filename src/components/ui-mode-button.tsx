import {Button} from './button.js';
import {Icon} from './icon.js';
import {uiMode} from '../state-machines/ui-mode.js';
import * as React from 'react';

const titles = {
  isShowingControls: `Showing controls`,
  isHidingControls: `Hiding controls`,
};

const iconTypes = {
  isShowingControls: `eye`,
  isHidingControls: `eyeSlash`,
} as const;

export function UiModeButton(): JSX.Element {
  const uiModeSnapshot = React.useSyncExternalStore(uiMode.subscribe, () => uiMode.get());

  const toggle = React.useCallback(() => {
    uiModeSnapshot.actions.toggle();
  }, [uiModeSnapshot]);

  return (
    <Button
      className="UiModeButton border-dashed"
      title={titles[uiModeSnapshot.state]}
      onClick={toggle}
    >
      <Icon type={iconTypes[uiModeSnapshot.state]} standalone />
    </Button>
  );
}
