import {Button} from './button.js';
import {Icon} from './icon.js';
import {useStore} from '../hooks/use-store.js';
import {uiModeStore} from '../stores/ui-mode-store.js';
import * as React from 'react';

const titles = {
  showControls: `Show controls`,
  hideControls: `Hide controls`,
};

const iconTypes = {
  showControls: `eye`,
  hideControls: `eyeSlash`,
} as const;

export function UiModeButton(): JSX.Element {
  const uiModeSnapshot = useStore(uiModeStore);

  const toggle = React.useCallback(() => {
    uiModeStore.get().actions.toggle();
  }, []);

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
