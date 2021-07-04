import {JSX} from 'preact';
import {useCallback} from 'preact/hooks';
import {JsonStorage} from '../singletons/json-storage';
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
  const sortOrder = JsonStorage.singleton.use('sortOrder');

  const toggleSortOrder = useCallback(() => {
    if (sortOrder === 'clickCount') {
      JsonStorage.singleton.set('sortOrder', 'timeAsc');
    } else if (sortOrder === 'timeAsc') {
      JsonStorage.singleton.set('sortOrder', 'timeDesc');
    } else {
      JsonStorage.singleton.set('sortOrder', 'clickCount');
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
