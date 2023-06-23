import type {appMachine} from '../machines/app-machine.js';
import type {InferSnapshot} from 'state-guard';

import {Button} from './button.js';
import {ColorSchemeButton} from './color-scheme-button.js';
import {Headline} from './headline.js';
import {Icon} from './icon.js';
import {TopbarItem} from './topbar-item.js';
import {beginAuthorization} from '../utils/begin-authorization.js';
import {joinClassNames} from '../utils/join-class-names.js';
import * as React from 'react';

export interface UserTopbarProps {
  appSnapshot: InferSnapshot<typeof appMachine, any>;
}

export function Topbar({appSnapshot}: UserTopbarProps): JSX.Element {
  return (
    <div
      className={joinClassNames(
        `Topbar`,
        `flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0`,
      )}
    >
      <TopbarItem>
        <Headline />
      </TopbarItem>

      <TopbarItem>
        <ColorSchemeButton />

        {appSnapshot.state === `isInitialized` ? (
          <Button className="SignInButton" title="Sign in with GitHub" onClick={beginAuthorization}>
            <Icon type="arrowLeftOnRectangle" />
            Sign in with GitHub
          </Button>
        ) : (
          <Button
            className="SignOutButton"
            title="Sign out"
            onClick={appSnapshot.actions.setInitialized}
          >
            <Icon type="arrowRightOnRectangle" />
            Sign out
          </Button>
        )}
      </TopbarItem>
    </div>
  );
}
