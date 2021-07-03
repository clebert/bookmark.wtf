import {JSX} from 'preact';
import {BookmarkSortOrder} from '../hooks/use-bookmark-sort';
import {Button} from './button';
import {Icon} from './icon';

export interface SortOrderButtonProps {
  readonly sortOrder: BookmarkSortOrder;

  onChangeSortOrder(): void;
}

const titles = {
  timeAsc: 'Sorting by time (ascending)',
  timeDesc: 'Sorting by time (descending)',
  clickCount: 'Sorting by click count',
};

const iconTypes = {
  timeAsc: 'sortAscending',
  timeDesc: 'sortDescending',
  clickCount: 'cursorClick',
} as const;

export function SortOrderButton({
  sortOrder,
  onChangeSortOrder,
}: SortOrderButtonProps): JSX.Element {
  return (
    <Button
      class="SortOrderButton"
      title={titles[sortOrder]}
      onClick={onChangeSortOrder}
    >
      <Icon type={iconTypes[sortOrder]} standalone />
    </Button>
  );
}
