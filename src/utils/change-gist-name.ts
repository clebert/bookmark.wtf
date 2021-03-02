import {HistoryChange} from '../hooks/use-history';

export function changeGistName(value: string | undefined): HistoryChange {
  return {type: 'pathname', pathname: '/' + (value ?? '')};
}
