import {BulmaField, BulmaInput, BulmaLevel} from '@clebert/bulma-preact';
import {JSX, h} from 'preact';
import {useGistName} from '../../hooks/use-gist-name';
import {useInputCallback} from '../../hooks/use-input-callback';
import {useSearchTerm} from '../../hooks/use-search-term';
import {UserContext, UserDependencies, useUser} from '../../hooks/use-user';
import {AppName} from '../app-name';
import {CloseGistButton} from '../buttons/close-gist-button';
import {SignOutButton} from '../buttons/sign-out-button';
import {GistView} from '../views/gist-view';
import {NoGistView} from '../views/no-gist-view';

export interface AuthorizedScreenProps extends UserDependencies {}

export function AuthorizedScreen({
  authState,
}: AuthorizedScreenProps): JSX.Element {
  const gistNameState = useGistName();
  const userState = useUser({authState});
  const searchTerm = useSearchTerm();
  const handleSearchTermChange = useInputCallback(searchTerm.setValue);

  return (
    <UserContext.Provider value={userState}>
      <BulmaLevel
        items={[<AppName />, <SignOutButton authState={authState} />]}
        rightItems={
          gistNameState.status === 'set'
            ? [
                <BulmaField isHidden="touch">
                  <BulmaInput
                    size="small"
                    placeholder="Enter search term"
                    value={searchTerm.value}
                    isAutoFocused
                    isRequired
                    isRounded
                    onChange={handleSearchTermChange}
                  />
                </BulmaField>,
                <CloseGistButton gistNameState={gistNameState} />,
              ]
            : []
        }
      />

      {gistNameState.status === 'set' ? (
        <GistView authState={authState} gistNameState={gistNameState} />
      ) : (
        <NoGistView authState={authState} gistNameState={gistNameState} />
      )}
    </UserContext.Provider>
  );
}
