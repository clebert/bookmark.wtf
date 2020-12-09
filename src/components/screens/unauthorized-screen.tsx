import {
  BulmaContent,
  BulmaHero,
  BulmaImage,
  BulmaLevel,
  BulmaTitle,
} from '@clebert/bulma-preact';
import {Fragment, JSX, h} from 'preact';
import {
  AuthorizingAuthState,
  UnauthorizedAuthState,
} from '../../hooks/use-auth';
import {assertIsString} from '../../utils/assert-is-string';
import {AppName} from '../app-name';
import {SignInButton} from '../buttons/sign-in-button';

export interface UnauthorizedScreenProps {
  readonly authState: UnauthorizedAuthState | AuthorizingAuthState;
}

const screenshotHash = process.env.SCREENSHOT_HASH;

assertIsString(screenshotHash, 'process.env.SCREENSHOT_HASH');

const screenshotGistName = '9803bde974539a8992c0515b28db439b';

export function UnauthorizedScreen({
  authState,
}: UnauthorizedScreenProps): JSX.Element {
  return (
    <>
      <BulmaLevel
        items={[<AppName />, <SignInButton authState={authState} />]}
      />

      <BulmaHero color="primary" isBold>
        <BulmaTitle size="3">Manage your bookmarks</BulmaTitle>

        <BulmaTitle size="4" isSubtitle>
          using <a href="https://gist.github.com">GitHub Gist</a> as data
          backend.
        </BulmaTitle>

        <a href={`https://bookmark.wtf/${screenshotGistName}`}>
          <BulmaImage src={`/images/screenshot.${screenshotHash}.png`} />
        </a>
      </BulmaHero>

      <BulmaHero>
        <BulmaContent size="small">
          <ol>
            <li>
              To use this web app, you need to sign in to GitHub and give it
              permission to access your gists.
            </li>

            <li>
              This web app does not track you or store data outside your browser
              or GitHub. The{' '}
              <a href="https://github.com/clebert/bookmark.wtf">source code</a>{' '}
              of it is publicly available.
            </li>

            <li>
              Your bookmarks are stored in markdown format in GitHub Gist. This
              allows you to use them without this web app. Please find{' '}
              <a href={`https://gist.github.com/${screenshotGistName}`}>here</a>{' '}
              an example.
            </li>

            <li>
              You can manage as many gists and thus bookmark collections as you
              like.
            </li>

            <li>
              By sharing the URL, other people can access your bookmark
              collections in read-only mode. Your bookmark collections,
              respectively your gists, are only "secret" as long as you do not
              share the URL with anyone.
            </li>
          </ol>
        </BulmaContent>
      </BulmaHero>
    </>
  );
}
