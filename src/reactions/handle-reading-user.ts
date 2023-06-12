import type {InferSnapshot} from 'state-guard';

import {readUser} from '../data/read-user.js';
import {app} from '../state-machines/app.js';
import {readGistName} from '../utils/read-gist-name.js';

export function handleReadingUser(isReadingUser: InferSnapshot<typeof app, 'isReadingUser'>): void {
  const {token} = isReadingUser.value;
  const {setError, readGists, readGist} = isReadingUser.actions;

  readUser({token})
    .then(({user}) => {
      if (isReadingUser === app.get(`isReadingUser`)) {
        const gistName = readGistName();

        if (gistName) {
          readGist({token, user, gistName});
        } else {
          readGists({token, user});
        }
      }
    })
    .catch((error: unknown) => {
      if (isReadingUser === app.get(`isReadingUser`)) {
        setError({error});
      }
    });
}
