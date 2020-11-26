import React from 'react';
import {BulmaContent} from '../../bulma/bulma-content';
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

      <BulmaHero color="dark" size="medium" isBold>
        <BulmaTitle size="3">Manage your bookmarks</BulmaTitle>

        <BulmaTitle size="4" isSubtitle>
          with <a href="https://gist.github.com">GitHub Gist</a> as data backend
        </BulmaTitle>
      </BulmaHero>

      <BulmaHero>
        <BulmaContent size="small">
          <ol>
            <li>
              To use this application, you need to sign in to GitHub and give it
              permission to access your gists.
            </li>

            <li>
              The application does not track you or store data outside your
              browser or GitHub. The{' '}
              <a href="https://github.com/clebert/bookmark.wtf">source code</a>{' '}
              of the application is publicly available.
            </li>

            <li>
              Your bookmarks are stored in markdown format (human and machine
              readable) in GitHub Gist. This allows you to use them without this
              application.
            </li>

            <li>
              You can manage as many gists and thus bookmark collections as you
              like.
            </li>

            <li>
              By sharing the URL, other people can access your bookmark
              collections. Your bookmark collections, respectively your gists,
              are only "secret" as long as you do not share the URL with anyone.
            </li>
          </ol>
        </BulmaContent>
      </BulmaHero>
    </>
  );
}
