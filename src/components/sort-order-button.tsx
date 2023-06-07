import {Button} from './button.js';
import {Icon} from './icon.js';
import {AppTopics} from '../pub-sub/app-topics.js';
import * as React from 'react';

const titles = {
  timeAsc: `Sorting by time (ascending)`,
  timeDesc: `Sorting by time (descending)`,
  clickCount: `Sorting by click count`,
};

const iconTypes = {
  timeAsc: `sortAscending`,
  timeDesc: `sortDescending`,
  clickCount: `cursorClick`,
} as const;

export function SortOrderButton(): JSX.Element {
  const sortOrder = AppTopics.sortOrder.use();

  const toggleSortOrder = React.useCallback(() => {
    if (sortOrder === `clickCount`) {
      AppTopics.sortOrder.publish(`timeAsc`);
    } else if (sortOrder === `timeAsc`) {
      AppTopics.sortOrder.publish(`timeDesc`);
    } else {
      AppTopics.sortOrder.publish(`clickCount`);
    }
  }, [sortOrder]);

  return (
    <Button
      class="SortOrderButton border-dashed"
      title={titles[sortOrder]}
      onClick={toggleSortOrder}
    >
      <Icon type={iconTypes[sortOrder]} standalone />
    </Button>
  );
}
