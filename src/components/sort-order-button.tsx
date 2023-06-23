import {Button} from './button.js';
import {Icon} from './icon.js';
import {sortOrderMachine} from '../machines/sort-order-machine.js';
import * as React from 'react';

const titles = {
  isClickCount: `Sorting by click count`,
  isTimeAsc: `Sorting by time (ascending)`,
  isTimeDesc: `Sorting by time (descending)`,
};

const iconTypes = {
  isClickCount: `cursorClick`,
  isTimeAsc: `sortAscending`,
  isTimeDesc: `sortDescending`,
} as const;

export function SortOrderButton(): JSX.Element {
  const sortOrderSnapshot = React.useSyncExternalStore(sortOrderMachine.subscribe, () =>
    sortOrderMachine.get(),
  );

  const toggle = React.useCallback(() => {
    sortOrderSnapshot.actions.toggle();
  }, [sortOrderSnapshot]);

  return (
    <Button
      className="SortOrderButton border-dashed"
      title={titles[sortOrderSnapshot.state]}
      onClick={toggle}
    >
      <Icon type={iconTypes[sortOrderSnapshot.state]} standalone />
    </Button>
  );
}
