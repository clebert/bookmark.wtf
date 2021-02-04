import {SuccessfulReceiver} from 'loxia';
import {useCallback, useMemo, useState} from 'preact/hooks';
import {GistData} from '../apis/fetch-gist-data';
import {GistRestApi} from '../apis/gist-rest-api';
import {assertIsString} from '../utils/assert-is-string';
import {AuthorizedAuth} from './use-auth';
import {useBinder} from './use-binder';
import {SetGistSelection} from './use-gist-selection';
import {useSender} from './use-sender';
import {useTransition} from './use-transition';

export interface GistDependencies {
  readonly auth: AuthorizedAuth;
  readonly userReceiver: SuccessfulReceiver<string>;
  readonly gistSelection: SetGistSelection;
  readonly gistDataReceiver: SuccessfulReceiver<GistData>;
}

export type Gist<TModel> =
  | IdleGist<TModel>
  | UpdatingGist<TModel>
  | LockedGist<TModel>
  | FailedGist;

export interface IdleGist<TModel> {
  readonly state: 'idle';
  readonly owner: string;
  readonly description: string;
  readonly files: readonly GistFile<TModel>[];
  readonly reason?: undefined;

  createFile(filename: string, newModel: TModel): boolean;

  updateFile(
    file: GistFile<TModel>,
    newModel: TModel,
    silent?: boolean
  ): boolean;

  deleteFile(file: GistFile<TModel>): boolean;
  updateGist(newDescription: string): boolean;
  deleteGist(): boolean;
}

export interface UpdatingGist<TModel> {
  readonly state: 'updating';
  readonly owner: string;
  readonly description: string;
  readonly files: readonly GistFile<TModel>[];
  readonly reason?: undefined;
  readonly createFile?: undefined;
  readonly updateFile?: undefined;
  readonly deleteFile?: undefined;
  readonly updateGist?: undefined;
  readonly deleteGist?: undefined;
}

export interface LockedGist<TModel> {
  readonly state: 'locked';
  readonly owner: string;
  readonly description: string;
  readonly files: readonly GistFile<TModel>[];
  readonly reason?: undefined;
  readonly createFile?: undefined;
  readonly updateFile?: undefined;
  readonly deleteFile?: undefined;
  readonly updateGist?: undefined;
  readonly deleteGist?: undefined;
}

export interface FailedGist {
  readonly state: 'failed';
  readonly owner?: undefined;
  readonly description?: undefined;
  readonly files?: undefined;
  readonly reason: unknown;
  readonly createFile?: undefined;
  readonly updateFile?: undefined;
  readonly deleteFile?: undefined;
  readonly updateGist?: undefined;
  readonly deleteGist?: undefined;
}

export interface GistFile<TModel> {
  readonly filename: string;
  readonly model: TModel;
}

export interface ModelAdapter<TModel> {
  parse(data: string): TModel | undefined;
  serialize(model: TModel): string;
  compare(modelA: TModel, modelB: TModel): -1 | 0 | 1;
}

export function useGist<TModel>(
  dependencies: GistDependencies,
  modelAdapter: ModelAdapter<TModel>
): Gist<TModel> {
  const {auth, userReceiver, gistSelection, gistDataReceiver} = dependencies;

  const owner = useMemo(() => {
    assertIsString(gistDataReceiver.value.owner?.login, 'owner');

    return gistDataReceiver.value.owner.login;
  }, []);

  const locked = useMemo(() => userReceiver.value !== owner, []);
  const restApi = useMemo(() => new GistRestApi(auth.token), []);
  const updateSender = useSender();

  const [description, setDescription] = useState(
    gistDataReceiver.value.description ?? ''
  );

  const [files, setFiles] = useState<readonly GistFile<TModel>[]>(() =>
    (gistDataReceiver.value.files ?? []).reduce((accu, file) => {
      if (file && file.name && file.text) {
        const model = modelAdapter.parse(file.text);

        if (model) {
          accu.push({filename: file.name, model});
        }
      }

      return accu;
    }, [] as GistFile<TModel>[])
  );

  const bind = useBinder();
  const transition = useTransition(updateSender, description, files);

  const updateGist = useCallback(
    (newDescription: string) =>
      transition(() => {
        setDescription(newDescription);

        updateSender.send?.(
          restApi.updateGist(gistDataReceiver.value.name, newDescription)
        );
      }),
    [transition]
  );

  const deleteGist = useCallback(
    () =>
      transition(() => {
        updateSender.send?.(
          restApi
            .deleteGist(gistDataReceiver.value.name)
            .then(bind(() => gistSelection.setGistName(undefined)))
        );
      }),
    [transition]
  );

  const createFile = useCallback(
    (filename: string, model: TModel) =>
      transition(() => {
        if (updateSender.state === 'idle') {
          setFiles((prevFiles) => [...prevFiles, {filename, model}]);

          updateSender.send(
            restApi.updateFile(
              gistDataReceiver.value.name,
              filename,
              modelAdapter.serialize(model)
            )
          );
        }
      }),
    [transition]
  );

  const updateFile = useCallback(
    (file: GistFile<TModel>, newModel: TModel, silent: boolean = false) =>
      transition(() => {
        if (updateSender.state !== 'idle') {
          return;
        }

        if (silent) {
          restApi
            .updateFile(
              gistDataReceiver.value.name,
              file.filename,
              modelAdapter.serialize(newModel)
            )
            .catch();
        } else {
          setFiles((prevFiles) =>
            prevFiles.map((prevFile) => {
              if (prevFile !== file) {
                return prevFile;
              }

              return {...prevFile, model: newModel};
            })
          );

          updateSender.send(
            restApi.updateFile(
              gistDataReceiver.value.name,
              file.filename,
              modelAdapter.serialize(newModel)
            )
          );
        }
      }),
    [transition]
  );

  const deleteFile = useCallback(
    (file: GistFile<TModel>) =>
      transition(() => {
        if (updateSender.state === 'idle') {
          setFiles((prevFiles) =>
            prevFiles.filter((prevFile) => prevFile !== file)
          );

          updateSender.send(
            restApi.deleteFile(gistDataReceiver.value.name, file.filename)
          );
        }
      }),
    [transition]
  );

  return useMemo(() => {
    if (updateSender.state === 'failed') {
      return updateSender;
    }

    const sortedFiles = [...files].sort((a, b) =>
      modelAdapter.compare(a.model, b.model)
    );

    if (locked || updateSender.state === 'sending') {
      const state = locked ? 'locked' : 'updating';

      return {state, owner, description, files: sortedFiles};
    }

    return {
      state: 'idle',
      owner,
      description,
      files: sortedFiles,
      createFile,
      updateFile,
      deleteFile,
      updateGist,
      deleteGist,
    };
  }, [transition]);
}
