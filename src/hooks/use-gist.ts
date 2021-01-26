import {SuccessfulReceiverState} from 'loxia';
import {useCallback, useMemo, useState} from 'preact/hooks';
import {GistData} from '../apis/fetch-gist-data';
import {GistRestApi} from '../apis/gist-rest-api';
import {assertIsString} from '../utils/assert-is-string';
import {AuthorizedAuthState} from './use-auth';
import {useBinder} from './use-binder';
import {SetGistNameState} from './use-gist-name';
import {useSender} from './use-sender';

export interface GistDependencies {
  readonly authState: AuthorizedAuthState;
  readonly userState: SuccessfulReceiverState<string>;
  readonly gistNameState: SetGistNameState;
  readonly gistDataState: SuccessfulReceiverState<GistData>;
}

export type GistState<TModel> =
  | ReadyGistState<TModel>
  | UpdatingGistState<TModel>
  | LockedGistState<TModel>
  | FailedGistState; // TODO: rename

export interface ReadyGistState<TModel> {
  readonly status: 'ready';
  readonly owner: string;
  readonly description: string;
  readonly files: readonly GistFile<TModel>[];
  readonly error: undefined;
  readonly createFile: (filename: string, newModel: TModel) => void;

  readonly updateFile: (
    file: GistFile<TModel>,
    newModel: TModel,
    silent?: boolean
  ) => void;

  readonly deleteFile: (file: GistFile<TModel>) => void;
  readonly updateGist: (newDescription: string) => void;
  readonly deleteGist: () => void;
}

export interface UpdatingGistState<TModel> {
  readonly status: 'updating';
  readonly owner: string;
  readonly description: string;
  readonly files: readonly GistFile<TModel>[];
  readonly error?: undefined;
  readonly createFile?: undefined;
  readonly updateFile?: undefined;
  readonly deleteFile?: undefined;
  readonly updateGist?: undefined;
  readonly deleteGist?: undefined;
}

export interface LockedGistState<TModel> {
  readonly status: 'locked';
  readonly owner: string;
  readonly description: string;
  readonly files: readonly GistFile<TModel>[];
  readonly error?: undefined;
  readonly createFile?: undefined;
  readonly updateFile?: undefined;
  readonly deleteFile?: undefined;
  readonly updateGist?: undefined;
  readonly deleteGist?: undefined;
}

export interface FailedGistState {
  readonly status: 'failed';
  readonly owner?: undefined;
  readonly description?: undefined;
  readonly files?: undefined;
  readonly error: Error;
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

export interface ModelBackend<TModel> {
  parseModel(data: string): TModel | undefined;
  serializeModel(model: TModel): string;
  compareModels(modelA: TModel, modelB: TModel): -1 | 0 | 1;
}

export function useGist<TModel>(
  dependencies: GistDependencies,
  modelBackend: ModelBackend<TModel>
): GistState<TModel> {
  const {authState, userState, gistNameState, gistDataState} = dependencies;

  const owner = useMemo(() => {
    assertIsString(gistDataState.value.owner?.login, 'owner');

    return gistDataState.value.owner.login;
  }, []);

  const locked = useMemo(() => userState.value !== owner, []);
  const restApi = useMemo(() => new GistRestApi(authState.token), []);
  const updateState = useSender();

  const [description, setDescription] = useState(
    gistDataState.value.description ?? ''
  );

  const updateGist = useCallback(
    (newDescription: string) => {
      setDescription(newDescription);

      updateState.send?.(
        restApi.updateGist(gistDataState.value.name, newDescription)
      );
    },
    [updateState]
  );

  const bind = useBinder();

  const deleteGist = useCallback(() => {
    updateState.send?.(
      restApi
        .deleteGist(gistDataState.value.name)
        .then(bind(() => gistNameState.setGistName(undefined)))
    );
  }, [updateState]);

  const [files, setFiles] = useState<readonly GistFile<TModel>[]>(() =>
    (gistDataState.value.files ?? []).reduce((accu, file) => {
      if (file && file.name && file.text) {
        const model = modelBackend.parseModel(file.text);

        if (model) {
          accu.push({filename: file.name, model});
        }
      }

      return accu;
    }, [] as GistFile<TModel>[])
  );

  const createFile = useCallback(
    (filename: string, model: TModel) => {
      if (updateState.status === 'idle') {
        setFiles((prevFiles) => [...prevFiles, {filename, model}]);

        updateState.send(
          restApi.updateFile(
            gistDataState.value.name,
            filename,
            modelBackend.serializeModel(model)
          )
        );
      }
    },
    [updateState]
  );

  const updateFile = useCallback(
    (file: GistFile<TModel>, newModel: TModel, silent: boolean = false) => {
      if (updateState.status !== 'idle') {
        return;
      }

      if (silent) {
        restApi
          .updateFile(
            gistDataState.value.name,
            file.filename,
            modelBackend.serializeModel(newModel)
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

        updateState.send(
          restApi.updateFile(
            gistDataState.value.name,
            file.filename,
            modelBackend.serializeModel(newModel)
          )
        );
      }
    },
    [updateState]
  );

  const deleteFile = useCallback(
    (file: GistFile<TModel>) => {
      if (updateState.status === 'idle') {
        setFiles((prevFiles) =>
          prevFiles.filter((prevFile) => prevFile !== file)
        );

        updateState.send(
          restApi.deleteFile(gistDataState.value.name, file.filename)
        );
      }
    },
    [updateState]
  );

  return useMemo(() => {
    if (updateState.status === 'failed') {
      return {status: 'failed', error: updateState.error};
    }

    const sortedFiles = [...files].sort((a, b) =>
      modelBackend.compareModels(a.model, b.model)
    );

    if (locked || updateState.status === 'sending') {
      const status = locked ? 'locked' : 'updating';

      return {status, owner, description, files: sortedFiles};
    }

    return {
      status: 'ready',
      owner,
      description,
      files: sortedFiles,
      createFile,
      updateFile,
      deleteFile,
      updateGist,
      deleteGist,
    };
  }, [updateState, description, files]);
}
