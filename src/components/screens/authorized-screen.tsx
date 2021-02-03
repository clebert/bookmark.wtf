import {BulmaField, BulmaInput, BulmaLevel} from '@clebert/bulma-preact';
import {JSX, h} from 'preact';
import {useGistSelection} from '../../hooks/use-gist-selection';
import {useInputCallback} from '../../hooks/use-input-callback';
import {useSearchTerm} from '../../hooks/use-search-term';
import {
  UserReceiverContext,
  UserReceiverDependencies,
  useUserReceiver,
} from '../../hooks/use-user-receiver';
import {AppName} from '../app-name';
import {CloseGistButton} from '../buttons/close-gist-button';
import {SignOutButton} from '../buttons/sign-out-button';
import {GistView} from '../views/gist-view';
import {NoGistView} from '../views/no-gist-view';

export interface AuthorizedScreenProps extends UserReceiverDependencies {}

export function AuthorizedScreen({auth}: AuthorizedScreenProps): JSX.Element {
  const gistSelection = useGistSelection();
  const userReceiver = useUserReceiver({auth});
  const searchTerm = useSearchTerm();
  const handleSearchTermChange = useInputCallback(searchTerm.setValue);

  return (
    <UserReceiverContext.Provider value={userReceiver}>
      <BulmaLevel
        items={[<AppName />, <SignOutButton auth={auth} />]}
        rightItems={
          gistSelection.state === 'set'
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
                <CloseGistButton gistSelection={gistSelection} />,
              ]
            : []
        }
      />

      {gistSelection.state === 'set' ? (
        <GistView auth={auth} gistSelection={gistSelection} />
      ) : (
        <NoGistView auth={auth} gistSelection={gistSelection} />
      )}
    </UserReceiverContext.Provider>
  );
}
