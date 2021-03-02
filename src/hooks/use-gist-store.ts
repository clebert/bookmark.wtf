import {SuccessfulReceiver} from 'loxia';
import {useCallback, useMemo} from 'preact/hooks';
import {Gist, fetchGist} from '../apis/fetch-gist';
import {fetchGithubApi} from '../apis/fetch-github-api';
import {AuthorizedAuthStore} from './use-auth-store';
import {useMemory} from './use-memory';
import {useReceiver} from './use-receiver';
import {useSender} from './use-sender';
import {useTransition} from './use-transition';

export type GistStore =
  | LoadingGistStore
  | ReadyGistStore
  | UpdatingGistStore
  | LockedGistStore
  | FailedGistStore;

export interface LoadingGistStore {
  readonly state: 'loading';

  readonly gist?: undefined;
  readonly reason?: undefined;
  readonly createFile?: undefined;
  readonly updateFile?: undefined;
  readonly deleteFile?: undefined;
}

export interface ReadyGistStore {
  readonly state: 'ready';
  readonly gist: Gist;

  createFile(filename: string, text: string): boolean;
  updateFile(filename: string, text: string, hidden?: boolean): boolean;
  deleteFile(filename: string): boolean;

  readonly reason?: undefined;
}

export interface UpdatingGistStore {
  readonly state: 'updating';
  readonly gist: Gist;

  readonly reason?: undefined;
  readonly createFile?: undefined;
  readonly updateFile?: undefined;
  readonly deleteFile?: undefined;
}

export interface LockedGistStore {
  readonly state: 'locked';
  readonly gist: Gist;

  readonly reason?: undefined;
  readonly createFile?: undefined;
  readonly updateFile?: undefined;
  readonly deleteFile?: undefined;
}

export interface FailedGistStore {
  readonly state: 'failed';
  readonly reason: unknown;

  readonly gist?: undefined;
  readonly createFile?: undefined;
  readonly updateFile?: undefined;
  readonly deleteFile?: undefined;
}

export function useGistStore(
  authStore: AuthorizedAuthStore,
  userReceiver: SuccessfulReceiver<string>,
  gistName: string
): GistStore {
  const gistReceiver = useReceiver(
    useMemo(() => fetchGist(authStore.token, gistName), [authStore, gistName])
  );

  const gistMemory = useMemory(gistReceiver.value, [gistReceiver]);
  const sender = useSender();
  const transition = useTransition(userReceiver, gistReceiver, sender);

  const createFile = useCallback(
    (filename: string, text: string) =>
      transition(() => {
        const sent = sender.send?.(
          fetchGithubApi({
            method: 'PATCH',
            pathname: `/gists/${gistName}`,
            params: {files: {[filename]: {content: text}}},
            token: authStore.token,
          })
        );

        if (sent) {
          const gist = gistMemory.value!;

          gistMemory.value = {
            ...gist,
            files: [{filename, text}, ...gist.files],
          };
        }
      }),
    [transition]
  );

  const updateFile = useCallback(
    (filename: string, text: string, hidden: boolean = false) =>
      transition(() => {
        const sent = sender.send?.(
          fetchGithubApi({
            method: 'PATCH',
            pathname: `/gists/${gistName}`,
            params: {files: {[filename]: {content: text}}},
            token: authStore.token,
          })
        );

        if (sent && !hidden) {
          const gist = gistMemory.value!;

          gistMemory.value = {
            ...gist,
            files: [
              {filename, text},
              ...gist.files.filter((file) => file.filename !== filename),
            ],
          };
        }
      }),
    [transition]
  );

  const deleteFile = useCallback(
    (filename: string) =>
      transition(() => {
        const sent = sender.send?.(
          fetchGithubApi({
            method: 'PATCH',
            pathname: `/gists/${gistName}`,
            params: {files: {[filename]: null}},
            token: authStore.token,
          })
        );

        if (sent) {
          const gist = gistMemory.value!;

          gistMemory.value = {
            ...gist,
            files: gist.files.filter((file) => file.filename !== filename),
          };
        }
      }),
    [transition]
  );

  return useMemo(() => {
    if (gistReceiver.state === 'failed') {
      return {state: 'failed', reason: gistReceiver.reason};
    }

    if (sender.state === 'failed') {
      return {state: 'failed', reason: sender.reason};
    }

    if (gistReceiver.state === 'receiving') {
      return {state: 'loading'};
    }

    const gist = gistMemory.value!;

    if (gist.owner !== userReceiver.value) {
      return {state: 'locked', gist};
    }

    if (sender.state === 'sending') {
      return {state: 'updating', gist};
    }

    return {state: 'ready', gist, createFile, updateFile, deleteFile};
  }, [transition]);
}
