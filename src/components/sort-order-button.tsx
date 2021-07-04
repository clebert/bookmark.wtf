import {JSX} from 'preact';
import {useCallback} from 'preact/hooks';
import {AppStorage} from '../pub-sub/app-storage';
import {Button} from './button';
import {Icon} from './icon';

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

export function SortOrderButton(): JSX.Element {
  const sortOrder = AppStorage.singleton.useSortOrder();

  const toggleSortOrder = useCallback(() => {
    if (sortOrder === 'clickCount') {
      AppStorage.singleton.setSortOrder('timeAsc');
    } else if (sortOrder === 'timeAsc') {
      AppStorage.singleton.setSortOrder('timeDesc');
    } else {
      AppStorage.singleton.setSortOrder('clickCount');
    }
  }, [sortOrder]);

  return (
    <Button
      class="SortOrderButton"
      title={titles[sortOrder]}
      onClick={toggleSortOrder}
    >
      <Icon type={iconTypes[sortOrder]} standalone />
    </Button>
  );
}
