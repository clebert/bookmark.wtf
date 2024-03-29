import type {InferSnapshot} from 'state-guard';

import {createGist} from '../data/create-gist.js';
import {deleteGist} from '../data/delete-gist.js';
import {updateGist} from '../data/update-gist.js';
import {appMachine} from '../machines/app-machine.js';

const defaultFiles = {
  [`.bookmark.wtf.md`]: {
    content: `# This gist is automatically generated by https://bookmark.wtf`,
  },
};

export function handleUpdatingGists(
  isUpdatingGists: InferSnapshot<typeof appMachine, 'isUpdatingGists'>,
): void {
  const {token, user, gists, operation} = isUpdatingGists.value;
  const {setError, setGists} = isUpdatingGists.actions;

  let promise: Promise<unknown>;

  switch (operation.type) {
    case `createGist`: {
      const {description} = operation;

      promise = createGist({token, description, files: defaultFiles}).then(({gistName}) => {
        if (isUpdatingGists === appMachine.get(`isUpdatingGists`)) {
          const newGists = [{gistName, description}, ...gists];

          setGists({token, user, gists: newGists});
        }
      });

      break;
    }
    case `updateGist`: {
      const {gistName, description} = operation;

      promise = updateGist({token, gistName, description}).then(() => {
        if (isUpdatingGists === appMachine.get(`isUpdatingGists`)) {
          const newGists = [
            {gistName, description},
            ...gists.filter((gist) => gist.gistName !== gistName),
          ];

          setGists({token, user, gists: newGists});
        }
      });

      break;
    }
    case `deleteGist`: {
      const {gistName} = operation;

      promise = deleteGist({token, gistName}).then(() => {
        if (isUpdatingGists === appMachine.get(`isUpdatingGists`)) {
          const newGists = gists.filter((gist) => gist.gistName !== gistName);

          setGists({token, user, gists: newGists});
        }
      });
    }
  }

  promise.catch((error: unknown) => {
    if (isUpdatingGists === appMachine.get(`isUpdatingGists`)) {
      setError({error});
    }
  });
}
