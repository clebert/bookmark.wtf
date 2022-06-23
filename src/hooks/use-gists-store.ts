import {useMemo} from 'preact/hooks';
import type {GistFile} from '../apis/gist-api.js';
import type {ShallowGist} from '../apis/gists-api.js';
import {GistsAPI} from '../apis/gists-api.js';
import type {AuthorizedAuthStore} from './use-auth-store.js';
import {useReceiver} from './use-receiver.js';
import {useSender} from './use-sender.js';
import {useTransition} from './use-transition.js';

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

export function useGistsStore(
  authStore: AuthorizedAuthStore,
  mainFile: GistFile,
): GistsStore {
  const gistsAPIReceiver = useReceiver(
    useMemo(
      async () => GistsAPI.init(authStore.token, mainFile),
      [authStore, mainFile],
    ),
  );

  const gistsAPISender = useSender();
  const transition = useTransition(gistsAPIReceiver, gistsAPISender);

  const createGist = (description: string) =>
    transition(() =>
      gistsAPISender.send?.(gistsAPIReceiver.value!.createGist(description)),
    );

  const updateGist = (gistName: string, description: string) =>
    transition(() =>
      gistsAPISender.send?.(
        gistsAPIReceiver.value!.updateGist(gistName, description),
      ),
    );

  const deleteGist = (gistName: string) =>
    transition(() =>
      gistsAPISender.send?.(gistsAPIReceiver.value!.deleteGist(gistName)),
    );

  return useMemo(() => {
    if (gistsAPIReceiver.state === `failed`) {
      return {state: `failed`, reason: gistsAPIReceiver.reason};
    }

    if (gistsAPISender.state === `failed`) {
      return {state: `failed`, reason: gistsAPISender.reason};
    }

    if (gistsAPIReceiver.state === `receiving`) {
      return {state: `loading`};
    }

    const {gists} = gistsAPIReceiver.value;

    if (gistsAPISender.state === `sending`) {
      return {state: `updating`, gists};
    }

    return {state: `ready`, gists, createGist, updateGist, deleteGist};
  }, [transition]);
}
