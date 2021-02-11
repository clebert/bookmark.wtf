import {useCallback, useMemo} from 'preact/hooks';
import {ShallowGist, fetchGists} from '../apis/fetch-gists';
import {fetchGithubApi} from '../apis/fetch-github-api';
import {useBinder} from './use-binder';
import {useMemory} from './use-memory';
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

  readonly gists?: undefined;
  readonly reason?: undefined;
  readonly createGist?: undefined;
  readonly updateGist?: undefined;
  readonly deleteGist?: undefined;
}

export interface ReadyGistsStore {
  readonly state: 'ready';
  readonly gists: readonly ShallowGist[];

  createGist(description: string): boolean;
  updateGist(gistName: string, description: string): boolean;
  deleteGist(gistName: string): boolean;

  readonly reason?: undefined;
}

export interface UpdatingGistsStore {
  readonly state: 'updating';
  readonly gists: readonly ShallowGist[];

  readonly reason?: undefined;
  readonly createGist?: undefined;
  readonly updateGist?: undefined;
  readonly deleteGist?: undefined;
}

export interface FailedGistsStore {
  readonly state: 'failed';
  readonly reason: unknown;

  readonly gists?: undefined;
  readonly createGist?: undefined;
  readonly updateGist?: undefined;
  readonly deleteGist?: undefined;
}

export function useGistsStore(token: string, appUrl: string): GistsStore {
  const mainFilename = useMemo(() => `.${new URL(appUrl).hostname}.md`, [
    appUrl,
  ]);

  const gistsReceiver = useReceiver(
    useMemo(
      () =>
        fetchGists(token).then((gists) =>
          gists.filter(({filenames}) => filenames.includes(mainFilename))
        ),
      [token, mainFilename]
    )
  );

  const gistsMemory = useMemory(gistsReceiver.value, [gistsReceiver]);
  const sender = useSender();
  const transition = useTransition(gistsReceiver, sender);
  const bind = useBinder();

  const createGist = useCallback(
    (description: string) =>
      transition(() => {
        const files = {
          [mainFilename]: '# This gist is maintained via ' + appUrl,
        };

        sender.send?.(
          fetchGithubApi({
            method: 'POST',
            pathname: '/gists',
            params: {
              description,
              files: Object.entries(files).reduce((accu, [filename, text]) => {
                accu[filename] = {content: text};

                return accu;
              }, {} as Record<string, {content: string}>),
            },
            token,
          }).then(
            bind(
              ({data}) =>
                (gistsMemory.value = [
                  {
                    gistName: data?.id,
                    description,
                    filenames: Object.keys(files),
                    mtime: Date.now(),
                  },
                  ...gistsMemory.value!,
                ])
            )
          )
        );
      }),
    [transition]
  );

  const updateGist = useCallback(
    (gistName: string, description: string) =>
      transition(() => {
        const sent = sender.send?.(
          fetchGithubApi({
            method: 'PATCH',
            pathname: `/gists/${gistName}`,
            params: {description},
            token,
          })
        );

        if (sent) {
          const gists = gistsMemory.value!;

          const gist = gists.find(
            (otherGist) => otherGist.gistName === gistName
          );

          if (gist) {
            gistsMemory.value = [
              {...gist, description, mtime: Date.now()},
              ...gists.filter((otherGist) => otherGist !== gist),
            ];
          }
        }
      }),
    [transition]
  );

  const deleteGist = useCallback(
    (gistName: string) =>
      transition(() => {
        const sent = sender.send?.(
          fetchGithubApi({
            method: 'DELETE',
            pathname: `/gists/${gistName}`,
            params: {},
            token,
          })
        );

        if (sent) {
          gistsMemory.value = [
            ...gistsMemory.value!.filter((gist) => gist.gistName !== gistName),
          ];
        }
      }),
    [transition]
  );

  return useMemo(() => {
    if (gistsReceiver.state === 'failed') {
      return {state: 'failed', reason: gistsReceiver.reason};
    }

    if (sender.state === 'failed') {
      return {state: 'failed', reason: sender.reason};
    }

    if (gistsReceiver.state === 'receiving') {
      return {state: 'loading'};
    }

    const gists = gistsMemory.value!;

    if (sender.state === 'sending') {
      return {state: 'updating', gists};
    }

    return {state: 'ready', gists, createGist, updateGist, deleteGist};
  }, [transition]);
}
