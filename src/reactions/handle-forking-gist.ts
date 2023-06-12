import type {InferSnapshot} from 'state-guard';

import {forkGist} from '../data/fork-gist.js';
import {app} from '../state-machines/app.js';
import {writeGistName} from '../utils/write-gist-name.js';

export function handleForkingGist(isForkingGist: InferSnapshot<typeof app, 'isForkingGist'>): void {
  const {token, user, gistName, gist} = isForkingGist.value;
  const {setError, setGist} = isForkingGist.actions;

  forkGist({token, gistName})
    .then(({newGistName}) => {
      if (isForkingGist === app.get(`isForkingGist`)) {
        writeGistName(newGistName);
        setGist({token, user, gistName: newGistName, gist});
      }
    })
    .catch((error: unknown) => {
      if (isForkingGist === app.get(`isForkingGist`)) {
        setError({error});
      }
    });
}
