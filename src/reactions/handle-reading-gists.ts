import type {InferSnapshot} from 'state-guard';

import {readGists} from '../data/read-gists.js';
import {app} from '../state-machines/app.js';
import {writeGistName} from '../utils/write-gist-name.js';

export function handleReadingGists(
  isReadingGists: InferSnapshot<typeof app, 'isReadingGists'>,
): void {
  const {token, user} = isReadingGists.value;
  const {setError, setGists} = isReadingGists.actions;

  writeGistName(``);

  readGists({token, filenameFilter: `.bookmark.wtf.md`})
    .then(({gists}) => {
      if (isReadingGists === app.get(`isReadingGists`)) {
        setGists({token, user, gists});
      }
    })
    .catch((error: unknown) => {
      if (isReadingGists === app.get(`isReadingGists`)) {
        setError({error});
      }
    });
}
