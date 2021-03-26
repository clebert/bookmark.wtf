import {useMemo} from 'preact/hooks';
import {GistsAPI, ShallowGist} from '../apis/gists-api';
import {AuthorizedAuthStore} from './use-auth-store';
import {useReceiver} from './use-receiver';
import {useSender} from './use-sender';
import {useTransition} from './use-transition';

export type GistsStore =
  | LoadingGistsStore
  | ReadyGistsStore
  | UpdatingGistsStore
  | FailedGistsStore;

export interface LoadingGistsStore {
  readonly state: 'loading';
}

export interface ReadyGistsStore {
  readonly state: 'ready';
  readonly gists: readonly ShallowGist[];

  createGist(description: string): boolean;
  updateGist(gistName: string, description: string): boolean;
  deleteGist(gistName: string): boolean;
}

export interface UpdatingGistsStore {
  readonly state: 'updating';
  readonly gists: readonly ShallowGist[];
}

export interface FailedGistsStore {
  readonly state: 'failed';
  readonly reason: unknown;
}

export function useGistsStore(authStore: AuthorizedAuthStore): GistsStore {
  const gistsAPIReceiver = useReceiver(
    useMemo(() => GistsAPI.init(authStore.token), [authStore])
  );

  const gistsAPISender = useSender();
  const transition = useTransition(gistsAPIReceiver, gistsAPISender);

  const createGist = (description: string) =>
    transition(() =>
      gistsAPISender.send?.(gistsAPIReceiver.value!.createGist(description))
    );

  const updateGist = (gistName: string, description: string) =>
    transition(() =>
      gistsAPISender.send?.(
        gistsAPIReceiver.value!.updateGist(gistName, description)
      )
    );

  const deleteGist = (gistName: string) =>
    transition(() =>
      gistsAPISender.send?.(gistsAPIReceiver.value!.deleteGist(gistName))
    );

  return useMemo(() => {
    if (gistsAPIReceiver.state === 'failed') {
      return {state: 'failed', reason: gistsAPIReceiver.reason};
    }

    if (gistsAPISender.state === 'failed') {
      return {state: 'failed', reason: gistsAPISender.reason};
    }

    if (gistsAPIReceiver.state === 'receiving') {
      return {state: 'loading'};
    }

    const {gists} = gistsAPIReceiver.value;

    if (gistsAPISender.state === 'sending') {
      return {state: 'updating', gists};
    }

    return {state: 'ready', gists, createGist, updateGist, deleteGist};
  }, [transition]);
}
