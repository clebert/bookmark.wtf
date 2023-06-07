import type {AuthorizedAuthStore} from './use-auth-store.js';
import type {Gist} from '../apis/gist-api.js';

import {useBinder} from './use-binder.js';
import {useReceiver} from './use-receiver.js';
import {useSender} from './use-sender.js';
import {useTransition} from './use-transition.js';
import {GistAPI} from '../apis/gist-api.js';
import {AppTopics} from '../pub-sub/app-topics.js';
import * as React from 'react';

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
    skipLocalUpdate?: boolean,
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
  user: string,
  gistName: string,
): GistStore {
  const gistAPIReceiver = useReceiver(
    React.useMemo(
      async () => GistAPI.init(authStore.token, gistName),
      [authStore, gistName],
    ),
  );

  const gistAPISender = useSender();
  const transition = useTransition(user, gistAPIReceiver, gistAPISender);

  const createFile = (filename: string, text: string) =>
    transition(() => {
      if (
        gistAPIReceiver.state === `successful` &&
        gistAPISender.state !== `sending`
      ) {
        gistAPISender.send(gistAPIReceiver.value.createFile(filename, text));
      }
    });

  const updateFile = (
    filename: string,
    text: string,
    skipLocalUpdate?: boolean,
  ) =>
    transition(() => {
      if (
        gistAPIReceiver.state === `successful` &&
        gistAPISender.state !== `sending`
      ) {
        gistAPISender.send(
          gistAPIReceiver.value.updateFile(filename, text, skipLocalUpdate),
        );
      }
    });

  const deleteFile = (filename: string) =>
    transition(() => {
      if (
        gistAPIReceiver.state === `successful` &&
        gistAPISender.state !== `sending`
      ) {
        gistAPISender.send(gistAPIReceiver.value.deleteFile(filename));
      }
    });

  const bind = useBinder();

  const forkGist = () =>
    transition(() => {
      if (
        gistAPIReceiver.state === `successful` &&
        gistAPISender.state !== `sending`
      ) {
        gistAPISender.send(
          gistAPIReceiver.value
            .forkGist()
            .then(bind(AppTopics.gistName.publish)),
        );
      }
    });

  return React.useMemo(() => {
    if (gistAPIReceiver.state === `failed`) {
      return {state: `failed`, reason: gistAPIReceiver.error};
    }

    if (gistAPISender.state === `failed`) {
      return {state: `failed`, reason: gistAPISender.error};
    }

    if (gistAPIReceiver.state === `receiving`) {
      return {state: `loading`};
    }

    const {gist} = gistAPIReceiver.value;

    if (gist.owner !== user) {
      return gistAPISender.state === `sending`
        ? {state: `forking`, gist}
        : {state: `locked`, gist, forkGist};
    }

    if (gistAPISender.state === `sending`) {
      return {state: `updating`, gist};
    }

    return {state: `ready`, gist, createFile, updateFile, deleteFile};
  }, [transition]);
}
