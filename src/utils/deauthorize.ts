import {JsonStorage} from '../singletons/json-storage';

export function deauthorize(): void {
  JsonStorage.singleton.set('token', undefined);
}
