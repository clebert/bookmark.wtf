import {HistoryChange} from '../hooks/use-history';

export function changeSearchTerm(value: string | undefined): HistoryChange {
  return {type: 'param', key: 'search', value};
}
