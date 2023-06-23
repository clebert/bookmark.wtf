import type {InferSnapshot} from 'state-guard';

import {readGist} from '../data/read-gist.js';
import {appMachine} from '../machines/app-machine.js';
import {writeGistName} from '../utils/write-gist-name.js';

export function handleReadingGist(
  isReadingGist: InferSnapshot<typeof appMachine, 'isReadingGist'>,
): void {
  const {token, user, gistName} = isReadingGist.value;
  const {setError, setGist, setForeignGist} = isReadingGist.actions;

  writeGistName(gistName);

  readGist({token, gistName})
    .then(({gist}) => {
      if (isReadingGist === appMachine.get(`isReadingGist`)) {
        if (gist.owner === user) {
          setGist({token, user, gistName, gist});
        } else {
          setForeignGist({token, user, gistName, gist});
        }
      }
    })
    .catch((error: unknown) => {
      if (isReadingGist === appMachine.get(`isReadingGist`)) {
        setError({error});
      }
    });
}
