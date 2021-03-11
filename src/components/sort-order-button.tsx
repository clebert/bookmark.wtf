import {JSX, h} from 'preact';
import {BookmarkSortOrder} from '../hooks/use-bookmark-sort';
import {Button} from './button';
import {Icon} from './icon';

export interface SortOrderButtonProps {
  readonly sortOrder: BookmarkSortOrder;

  onChangeSortOrder(): void;
}

export function SortOrderButton({
  sortOrder,
  onChangeSortOrder,
}: SortOrderButtonProps): JSX.Element {
  return (
    <Button
      class="SortOrderButton"
      title="Change sort order"
      onClick={onChangeSortOrder}
    >
      <Icon
        type={
          sortOrder === 'timeAsc'
            ? 'sortAscending'
            : sortOrder === 'timeDesc'
            ? 'sortDescending'
            : 'cursorClick'
        }
        standalone
      />
    </Button>
  );
}
