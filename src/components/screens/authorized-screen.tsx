import {BulmaField, BulmaInput, BulmaLevel} from '@clebert/bulma-preact';
import {JSX, h} from 'preact';
import {useCallback, useContext, useMemo} from 'preact/hooks';
import {useGistName} from '../../hooks/use-gist-name';
import {HistoryContext} from '../../hooks/use-history';
import {useInputCallback} from '../../hooks/use-input-callback';
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
  const history = useContext(HistoryContext);

  const searchParams = useMemo(() => new URLSearchParams(history.search), [
    history,
  ]);

  const setSearchTerm = useInputCallback(
    useCallback(
      (value: string) => {
        if (value) {
          searchParams.set('search', value);
        } else {
          searchParams.delete('search');
        }

        const search = searchParams.toString();

        history.push({search: search ? '?' + search : ''});
      },
      [searchParams]
    )
  );

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
                    value={searchParams.get('search') ?? ''}
                    isAutoFocused
                    isRequired
                    isRounded
                    onChange={setSearchTerm}
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
