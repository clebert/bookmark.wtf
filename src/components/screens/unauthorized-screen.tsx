import React from 'react';
import {BulmaHero} from '../../bulma/bulma-hero';
import {BulmaLevel} from '../../bulma/bulma-level';
import {BulmaTitle} from '../../bulma/bulma-title';
import {
  AuthorizingAuthState,
  UnauthorizedAuthState,
} from '../../hooks/use-auth-state';
import {AppName} from '../app-name';
import {SignInButton} from '../buttons/sign-in-button';

export interface UnauthorizedScreenProps {
  readonly authState: UnauthorizedAuthState | AuthorizingAuthState;
}

export function UnauthorizedScreen({
  authState,
}: UnauthorizedScreenProps): JSX.Element {
  return (
    <>
      <BulmaLevel
        items={[<AppName />, <SignInButton authState={authState} />]}
      />

      <BulmaHero color="info" size="medium" isBold>
        <BulmaTitle size="3">Manage your bookmarks</BulmaTitle>

        <BulmaTitle size="4" isSubtitle>
          with <a href="https://gist.github.com">GitHub Gist</a> as data backend
        </BulmaTitle>
      </BulmaHero>
    </>
  );
}
