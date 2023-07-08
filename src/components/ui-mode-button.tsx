import {uiModeMachine} from '../machines/ui-mode-machine.js';
import * as React from 'react';
import {Button, Icon} from 'wtfkit';

const titles = {
  isShowingControls: `Showing controls`,
  isHidingControls: `Hiding controls`,
};

const iconTypes = {
  isShowingControls: `eye`,
  isHidingControls: `eyeSlash`,
} as const;

export function UiModeButton(): JSX.Element {
  const uiModeSnapshot = React.useSyncExternalStore(uiModeMachine.subscribe, () =>
    uiModeMachine.get(),
  );

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
