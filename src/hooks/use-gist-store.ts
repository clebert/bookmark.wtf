import {SuccessfulReceiver} from 'loxia';
import {useContext, useMemo} from 'preact/hooks';
import {Gist, GistAPI} from '../apis/gist-api';
import {changeGistName} from '../utils/change-gist-name';
import {AuthorizedAuthStore} from './use-auth-store';
import {useBinder} from './use-binder';
import {HistoryContext} from './use-history';
import {useReceiver} from './use-receiver';
import {useSender} from './use-sender';
import {useTransition} from './use-transition';

export type GistStore =
  | LoadingGistStore
  | ReadyGistStore
  | UpdatingGistStore
  | LockedGistStore
  | ForkingGistStore
  | FailedGistStore;

export interface LoadingGistStore {
  readonly state: 'loading';
}

export interface ReadyGistStore {
  readonly state: 'ready';
  readonly gist: Gist;

  createFile(filename: string, text: string): boolean;

  updateFile(
    filename: string,
    text: string,
    skipLocalUpdate?: boolean
  ): boolean;

  deleteFile(filename: string): boolean;
}

export interface UpdatingGistStore {
  readonly state: 'updating';
  readonly gist: Gist;
}

export interface LockedGistStore {
  readonly state: 'locked';
  readonly gist: Gist;

  forkGist(): boolean;
}

export interface ForkingGistStore {
  readonly state: 'forking';
  readonly gist: Gist;
}

export interface FailedGistStore {
  readonly state: 'failed';
  readonly reason: unknown;
}

export function useGistStore(
  authStore: AuthorizedAuthStore,
  userReceiver: SuccessfulReceiver<string>,
  gistName: string
): GistStore {
  const gistAPIReceiver = useReceiver(
    useMemo(() => GistAPI.init(authStore.token, gistName), [
      authStore,
      gistName,
    ])
  );

  const sender = useSender();
  const transition = useTransition(userReceiver, gistAPIReceiver, sender);

  const createFile = (filename: string, text: string) =>
    transition(() =>
      sender.send?.(gistAPIReceiver.value!.createFile(filename, text))
    );

  const updateFile = (
    filename: string,
    text: string,
    skipLocalUpdate?: boolean
  ) =>
    transition(() =>
      sender.send?.(
        gistAPIReceiver.value!.updateFile(filename, text, skipLocalUpdate)
      )
    );

  const deleteFile = (filename: string) =>
    transition(() =>
      sender.send?.(gistAPIReceiver.value!.deleteFile(filename))
    );

  const bind = useBinder();
  const history = useContext(HistoryContext);

  const forkGist = () =>
    transition(() =>
      sender.send?.(
        gistAPIReceiver
          .value!.fork()
          .then(
            bind((newGistName: string) =>
              history.push(changeGistName(newGistName))
            )
          )
      )
    );

  return useMemo(() => {
    if (gistAPIReceiver.state === 'failed') {
      return {state: 'failed', reason: gistAPIReceiver.reason};
    }

    if (sender.state === 'failed') {
      return {state: 'failed', reason: sender.reason};
    }

    if (gistAPIReceiver.state === 'receiving') {
      return {state: 'loading'};
    }

    const {gist} = gistAPIReceiver.value;

    if (gist.owner !== userReceiver.value) {
      return sender.state === 'sending'
        ? {state: 'forking', gist}
        : {state: 'locked', gist, forkGist};
    }

    if (sender.state === 'sending') {
      return {state: 'updating', gist};
    }

    return {state: 'ready', gist, createFile, updateFile, deleteFile};
  }, [transition]);
}
