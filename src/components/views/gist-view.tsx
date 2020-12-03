import {BulmaIcon, BulmaText} from '@clebert/bulma-react';
import {faExclamationTriangle} from '@fortawesome/free-solid-svg-icons';
import * as React from 'react';
import {GistDataDependencies, useGistData} from '../../hooks/use-gist-data';
import {UserContext} from '../../hooks/use-user';
import {assertIsString} from '../../utils/assert-is-string';
import {BookmarkList} from '../lists/bookmark-list';

export interface GistViewProps extends GistDataDependencies {}

const appName = process.env.APP_NAME;

assertIsString(appName, 'process.env.APP_NAME');

export function GistView({
  authState,
  gistNameState,
}: GistViewProps): JSX.Element | null {
  const userState = React.useContext(UserContext);
  const gistDataState = useGistData({authState, gistNameState});

  React.useEffect(() => {
    if (gistDataState.status === 'success') {
      document.title = `${gistDataState.value.description} - ${appName}`;

      return () => void (document.title = appName!);
    }

    return;
  }, [gistDataState]);

  if (
    gistDataState.status === 'receiving' ||
    userState.status === 'receiving'
  ) {
    return null;
  }

  if (gistDataState.status === 'failure' || userState.status === 'failure') {
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
      authState={authState}
      userState={userState}
      gistNameState={gistNameState}
      gistDataState={gistDataState}
    />
  );
}
