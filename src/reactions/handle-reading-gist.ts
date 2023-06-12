import type {InferSnapshot} from 'state-guard';

import {readGist} from '../data/read-gist.js';
import {app} from '../state-machines/app.js';
import {writeGistName} from '../utils/write-gist-name.js';

export function handleReadingGist(isReadingGist: InferSnapshot<typeof app, 'isReadingGist'>): void {
  const {token, user, gistName} = isReadingGist.value;
  const {setError, setGist, setForeignGist} = isReadingGist.actions;

  writeGistName(gistName);

  readGist({token, gistName})
    .then(({gist}) => {
      if (isReadingGist === app.get(`isReadingGist`)) {
        if (gist.owner === user) {
          setGist({token, user, gistName, gist});
        } else {
          setForeignGist({token, user, gistName, gist});
        }
      }
    })
    .catch((error: unknown) => {
      if (isReadingGist === app.get(`isReadingGist`)) {
        setError({error});
      }
    });
}
