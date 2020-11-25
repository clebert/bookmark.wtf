import {faExclamationTriangle} from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import {BulmaIcon} from '../../bulma/bulma-icon';
import {BulmaText} from '../../bulma/bulma-text';
import {AuthorizedAuthState} from '../../hooks/use-auth-state';
import {useGistDataState} from '../../hooks/use-gist-data-state';
import {SetGistNameState} from '../../hooks/use-gist-name-state';
import {UserStateContext} from '../../hooks/use-user-state';
import {assertIsString} from '../../utils/assert-is-string';
import {BookmarkList} from '../lists/bookmark-list';

export interface GistViewProps {
  readonly authState: AuthorizedAuthState;
  readonly gistNameState: SetGistNameState;
}

const appName = process.env.APP_NAME;

assertIsString(appName, 'process.env.APP_NAME');

export function GistView({
  authState,
  gistNameState,
}: GistViewProps): JSX.Element | null {
  const userState = React.useContext(UserStateContext);
  const gistDataState = useGistDataState(authState, gistNameState);

  React.useEffect(() => {
    if (gistDataState.status === 'received') {
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

  if (gistDataState.status === 'failed' || userState.status === 'failed') {
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
