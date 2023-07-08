import {handleForkingGist} from '../reactions/handle-forking-gist.js';
import {handleReadingGist} from '../reactions/handle-reading-gist.js';
import {handleReadingGists} from '../reactions/handle-reading-gists.js';
import {handleReadingUser} from '../reactions/handle-reading-user.js';
import {handleUpdatingGist} from '../reactions/handle-updating-gist.js';
import {handleUpdatingGists} from '../reactions/handle-updating-gists.js';
import {completeAuthorization} from '../utils/complete-authorization.js';
import {writeGistName} from '../utils/write-gist-name.js';
import {createMachine} from 'state-guard';
import {createJsonStorageItem} from 'wtfkit';
import {z} from 'zod';

export interface HasError {
  readonly error: unknown;
}

export interface IsReadingUser {
  readonly token: string;
}

export interface IsReadingGists extends IsReadingUser {
  readonly user: string;
}

export interface HasGists extends IsReadingGists {
  readonly gists: readonly {readonly gistName: string; readonly description: string}[];
}

export interface IsUpdatingGists extends HasGists {
  readonly operation:
    | {readonly type: 'createGist'; readonly description: string}
    | {readonly type: 'updateGist'; readonly gistName: string; readonly description: string}
    | {readonly type: 'deleteGist'; readonly gistName: string};
}

export interface IsReadingGist extends IsReadingUser {
  readonly user: string;
  readonly gistName: string;
}

export interface HasGist extends IsReadingGist {
  readonly gist: {
    readonly owner: string;
    readonly description: string;
    readonly files: Readonly<Record<string, {readonly content: string}>>;
  };
}

export interface IsUpdatingGist extends HasGist {
  readonly operation:
    | {readonly type: 'createFile'; readonly filename: string; readonly content: string}
    | {readonly type: 'updateFile'; readonly filename: string; readonly content: string}
    | {readonly type: 'deleteFile'; readonly filename: string};
}

export interface HasForeignGist extends HasGist {}
export interface IsForkingGist extends HasForeignGist {}

export const appMachine = createMachine({
  initialState: `isInitialized`,
  initialValue: undefined,
  transformerMap: {
    isInitialized: () => undefined,
    hasError: (value: HasError) => value,
    isReadingUser: (value: IsReadingUser) => value,
    isReadingGists: (value: IsReadingGists) => value,
    hasGists: (value: HasGists) => value,
    isUpdatingGists: (value: IsUpdatingGists) => value,
    isReadingGist: (value: IsReadingGist) => value,
    hasGist: (value: HasGist) => value,
    isUpdatingGist: (value: IsUpdatingGist) => value,
    hasForeignGist: (value: HasForeignGist) => value,
    isForkingGist: (value: IsForkingGist) => value,
  },
  transitionsMap: {
    isInitialized: {
      readUser: `isReadingUser`,
    },
    hasError: {
      setInitialized: `isInitialized`,
    },
    isReadingUser: {
      setInitialized: `isInitialized`,
      setError: `hasError`,
      readGists: `isReadingGists`,
      readGist: `isReadingGist`,
    },
    isReadingGists: {
      setInitialized: `isInitialized`,
      setError: `hasError`,
      setGists: `hasGists`,
    },
    hasGists: {
      setInitialized: `isInitialized`,
      updateGists: `isUpdatingGists`,
      readGist: `isReadingGist`,
    },
    isUpdatingGists: {
      setInitialized: `isInitialized`,
      setError: `hasError`,
      setGists: `hasGists`,
      readGist: `isReadingGist`,
    },
    isReadingGist: {
      setInitialized: `isInitialized`,
      setError: `hasError`,
      setGist: `hasGist`,
      setForeignGist: `hasForeignGist`,
    },
    hasGist: {
      setInitialized: `isInitialized`,
      updateGist: `isUpdatingGist`,
      readGists: `isReadingGists`,
    },
    isUpdatingGist: {
      setInitialized: `isInitialized`,
      setError: `hasError`,
      setGist: `hasGist`,
      readGists: `isReadingGists`,
    },
    hasForeignGist: {
      setInitialized: `isInitialized`,
      forkGist: `isForkingGist`,
      readGists: `isReadingGists`,
    },
    isForkingGist: {
      setInitialized: `isInitialized`,
      setError: `hasError`,
      setGist: `hasGist`,
    },
  },
});

const tokenStorageItem = createJsonStorageItem(`token`, z.string().nonempty());

appMachine.subscribe(() => {
  const appSnapshot = appMachine.get();

  switch (appSnapshot.state) {
    case `isInitialized`: {
      tokenStorageItem.value = undefined;

      writeGistName(``);

      break;
    }
    case `hasError`: {
      console.error(appSnapshot.value.error);

      writeGistName(``);

      break;
    }
    case `isReadingUser`: {
      handleReadingUser(appSnapshot);

      break;
    }
    case `isReadingGists`: {
      handleReadingGists(appSnapshot);

      break;
    }
    case `isUpdatingGists`: {
      handleUpdatingGists(appSnapshot);

      break;
    }
    case `isReadingGist`: {
      handleReadingGist(appSnapshot);

      break;
    }
    case `isUpdatingGist`: {
      handleUpdatingGist(appSnapshot);

      break;
    }
    case `isForkingGist`: {
      handleForkingGist(appSnapshot);
    }
  }
});

const token = tokenStorageItem.value ?? completeAuthorization();

if (token) {
  tokenStorageItem.value = token;

  appMachine.assert(`isInitialized`).actions.readUser({token});
}
