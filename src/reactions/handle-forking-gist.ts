import type {InferSnapshot} from 'state-guard';

import {forkGist} from '../data/fork-gist.js';
import {appMachine} from '../machines/app-machine.js';
import {writeGistName} from '../utils/write-gist-name.js';

export function handleForkingGist(
  isForkingGist: InferSnapshot<typeof appMachine, 'isForkingGist'>,
): void {
  const {token, user, gistName, gist} = isForkingGist.value;
  const {setError, setGist} = isForkingGist.actions;

  forkGist({token, gistName})
    .then(({newGistName}) => {
      if (isForkingGist === appMachine.get(`isForkingGist`)) {
        writeGistName(newGistName);
        setGist({token, user, gistName: newGistName, gist});
      }
    })
    .catch((error: unknown) => {
      if (isForkingGist === appMachine.get(`isForkingGist`)) {
        setError({error});
      }
    });
}
