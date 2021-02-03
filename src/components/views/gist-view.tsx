import {BulmaIcon, BulmaText} from '@clebert/bulma-preact';
import {faExclamationTriangle} from '@fortawesome/free-solid-svg-icons';
import {JSX, h} from 'preact';
import {useContext, useEffect} from 'preact/hooks';
import {
  GistDataReceiverDependencies,
  useGistDataReceiver,
} from '../../hooks/use-gist-data-receiver';
import {UserReceiverContext} from '../../hooks/use-user-receiver';
import {assertIsString} from '../../utils/assert-is-string';
import {BookmarkList} from '../lists/bookmark-list';

export interface GistViewProps extends GistDataReceiverDependencies {}

const appName = process.env.APP_NAME;

assertIsString(appName, 'process.env.APP_NAME');

export function GistView({
  auth,
  gistSelection,
}: GistViewProps): JSX.Element | null {
  const userReceiver = useContext(UserReceiverContext);
  const gistDataReceiver = useGistDataReceiver({auth, gistSelection});

  useEffect(() => {
    if (gistDataReceiver.state === 'successful') {
      document.title = `${gistDataReceiver.value.description} - ${appName}`;

      return () => void (document.title = appName!);
    }

    return;
  }, [gistDataReceiver]);

  if (
    gistDataReceiver.state === 'receiving' ||
    userReceiver.state === 'receiving'
  ) {
    return null;
  }

  if (gistDataReceiver.state === 'failed' || userReceiver.state === 'failed') {
    return (
      <BulmaText color="danger">
        <BulmaIcon definition={faExclamationTriangle}>
          Oops! Could not open the gist.
        </BulmaIcon>
      </BulmaText>
    );
  }

  return (
    <BookmarkList
      auth={auth}
      userReceiver={userReceiver}
      gistSelection={gistSelection}
      gistDataReceiver={gistDataReceiver}
    />
  );
}
