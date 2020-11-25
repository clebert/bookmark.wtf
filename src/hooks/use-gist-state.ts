import React from 'react';
import {GistRestApi} from '../apis/gist-rest-api';
import {GetGist_viewer_gist} from '../queries/__generated__/GetGist';
import {assertIsString} from '../utils/assert-is-string';
import {AuthorizedAuthState} from './use-auth-state';
import {SetGistNameState} from './use-gist-name-state';
import {ReceivedReceiverState} from './use-receiver-state';
import {useSenderState} from './use-sender-state';

export type GistState<TModel> =
  | ReadyGistState<TModel>
  | UpdatingGistState<TModel>
  | FailedGistState;

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
  readonly error: undefined;
  readonly createFile: undefined;
  readonly updateFile: undefined;
  readonly deleteFile: undefined;
  readonly updateGist: undefined;
  readonly deleteGist: undefined;
}

export interface FailedGistState {
  readonly status: 'failed';
  readonly owner: undefined;
  readonly description: undefined;
  readonly files: undefined;
  readonly error: Error;
  readonly createFile: undefined;
  readonly updateFile: undefined;
  readonly deleteFile: undefined;
  readonly updateGist: undefined;
  readonly deleteGist: undefined;
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

export function useGistState<TModel>(
  authState: AuthorizedAuthState,
  gistNameState: SetGistNameState,
  gistDataState: ReceivedReceiverState<GetGist_viewer_gist>,
  modelBackend: ModelBackend<TModel>
): GistState<TModel> {
  const owner = React.useMemo(() => {
    assertIsString(gistDataState.value.owner?.login, 'owner');

    return gistDataState.value.owner.login;
  }, []);

  const restApi = React.useMemo(() => new GistRestApi(authState.token), []);
  const updateState = useSenderState();

  const [description, setDescription] = React.useState(
    gistDataState.value.description ?? ''
  );

  const updateGist = React.useCallback(
    (newDescription) => {
      setDescription(newDescription);

      updateState.send?.(
        restApi.updateGist(gistDataState.value.name, newDescription)
      );
    },
    [updateState]
  );

  const deleteGist = React.useCallback(() => {
    updateState.send?.(restApi.deleteGist(gistDataState.value.name), () =>
      gistNameState.setGistName(undefined)
    );
  }, [updateState]);

  const [files, setFiles] = React.useState<readonly GistFile<TModel>[]>(() =>
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

  const createFile = React.useCallback(
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

  const updateFile = React.useCallback(
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

  const deleteFile = React.useCallback(
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

  return React.useMemo(() => {
    if (updateState.status === 'failed') {
      return {
        status: 'failed',
        owner: undefined,
        description: undefined,
        files: undefined,
        error: updateState.error,
        createFile: undefined,
        updateFile: undefined,
        deleteFile: undefined,
        updateGist: undefined,
        deleteGist: undefined,
      };
    }

    const sortedFiles = [...files].sort((a, b) =>
      modelBackend.compareModels(a.model, b.model)
    );

    if (updateState.status === 'sending') {
      return {
        status: 'updating',
        owner,
        description,
        files: sortedFiles,
        error: undefined,
        createFile: undefined,
        updateFile: undefined,
        deleteFile: undefined,
        updateGist: undefined,
        deleteGist: undefined,
      };
    }

    return {
      status: 'ready',
      owner,
      description,
      files: sortedFiles,
      error: undefined,
      createFile,
      updateFile,
      deleteFile,
      updateGist,
      deleteGist,
    };
  }, [updateState, description, files]);
}
