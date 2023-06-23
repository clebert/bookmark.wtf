import type {InferSnapshot} from 'state-guard';

import {readGists} from '../data/read-gists.js';
import {appMachine} from '../machines/app-machine.js';
import {writeGistName} from '../utils/write-gist-name.js';

export function handleReadingGists(
  isReadingGists: InferSnapshot<typeof appMachine, 'isReadingGists'>,
): void {
  const {token, user} = isReadingGists.value;
  const {setError, setGists} = isReadingGists.actions;

  writeGistName(``);

  readGists({token, filenameFilter: `.bookmark.wtf.md`})
    .then(({gists}) => {
      if (isReadingGists === appMachine.get(`isReadingGists`)) {
        setGists({token, user, gists});
      }
    })
    .catch((error: unknown) => {
      if (isReadingGists === appMachine.get(`isReadingGists`)) {
        setError({error});
      }
    });
}
