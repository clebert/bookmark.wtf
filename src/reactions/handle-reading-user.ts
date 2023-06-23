import type {InferSnapshot} from 'state-guard';

import {readUser} from '../data/read-user.js';
import {appMachine} from '../machines/app-machine.js';
import {readGistName} from '../utils/read-gist-name.js';

export function handleReadingUser(
  isReadingUser: InferSnapshot<typeof appMachine, 'isReadingUser'>,
): void {
  const {token} = isReadingUser.value;
  const {setError, readGists, readGist} = isReadingUser.actions;

  readUser({token})
    .then(({user}) => {
      if (isReadingUser === appMachine.get(`isReadingUser`)) {
        const gistName = readGistName();

        if (gistName) {
          readGist({token, user, gistName});
        } else {
          readGists({token, user});
        }
      }
    })
    .catch((error: unknown) => {
      if (isReadingUser === appMachine.get(`isReadingUser`)) {
        setError({error});
      }
    });
}
