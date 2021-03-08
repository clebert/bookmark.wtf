import {JSX, h} from 'preact';
import {AuthorizedAuthStore} from '../hooks/use-auth-store';
import {useGistName} from '../hooks/use-gist-name';
import {Button} from './button';
import {ColorSchemeButton} from './color-scheme-button';
import {Headline} from './headline';
import {Icon} from './icon';
import {SearchForm} from './search-form';
import {Topbar} from './topbar';
import {TopbarItem} from './topbar-item';

export interface UserTopbarProps {
  readonly authStore: AuthorizedAuthStore;
}

export function UserTopbar({authStore}: UserTopbarProps): JSX.Element {
  const gistName = useGistName();

  return (
    <Topbar class="Topbar">
      <TopbarItem>
        <Headline />
      </TopbarItem>

      <TopbarItem>
        <ColorSchemeButton />

        <Button class="SignOutButton" onClick={authStore.signOut}>
          <Icon type="logout" />
          Sign out
        </Button>
      </TopbarItem>

      {gistName && (
        <TopbarItem>
          <SearchForm />
        </TopbarItem>
      )}
    </Topbar>
  );
}
