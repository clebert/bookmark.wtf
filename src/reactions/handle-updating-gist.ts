import type {InferSnapshot} from 'state-guard';

import {updateGist} from '../data/update-gist.js';
import {app} from '../state-machines/app.js';

export function handleUpdatingGist(
  isUpdatingGist: InferSnapshot<typeof app, 'isUpdatingGist'>,
): void {
  const {token, user, gistName, gist, operation} = isUpdatingGist.value;
  const {setError, setGist} = isUpdatingGist.actions;

  updateGist({
    token,
    gistName,
    files: {
      [operation.filename]: operation.type === `deleteFile` ? null : {content: operation.content},
    },
  })
    .then(() => {
      if (isUpdatingGist !== app.get(`isUpdatingGist`)) {
        return;
      }

      const otherFiles = Object.entries(gist.files).filter(
        ([filename]) => filename !== operation.filename,
      );

      const files = Object.fromEntries(
        operation.type === `deleteFile`
          ? otherFiles
          : [[operation.filename, {content: operation.content}], ...otherFiles],
      );

      setGist({token, user, gistName, gist: {...gist, files}});
    })
    .catch((error: unknown) => {
      if (isUpdatingGist === app.get(`isUpdatingGist`)) {
        setError({error});
      }
    });
}
