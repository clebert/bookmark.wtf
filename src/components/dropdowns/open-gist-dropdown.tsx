import {faCaretDown} from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import {BulmaButton} from '../../bulma/bulma-button';
import {BulmaDropdown} from '../../bulma/bulma-dropdown';
import {BulmaIcon} from '../../bulma/bulma-icon';
import {AuthorizedAuthState} from '../../hooks/use-auth-state';
import {UnsetGistNameState} from '../../hooks/use-gist-name-state';
import {useGistOverviewState} from '../../hooks/use-gist-overview-state';
import {toggle} from '../../utils/toggle';
import {OpenGistDropdownItem} from './open-gist-dropdown-item';

export interface OpenGistDropdownProps {
  readonly authState: AuthorizedAuthState;
  readonly gistNameState: UnsetGistNameState;
  readonly isDisabled: boolean;
}

export function OpenGistDropdown({
  authState,
  gistNameState,
  isDisabled,
}: OpenGistDropdownProps): JSX.Element {
  const gistOverviewState = useGistOverviewState(authState);
  const [menu, setMenu] = React.useState(false);
  const toggleMenu = React.useCallback(() => setMenu(toggle), []);

  React.useEffect(() => {
    if (!menu) {
      return;
    }

    document.addEventListener('click', toggleMenu);

    return () => document.removeEventListener('click', toggleMenu);
  }, [menu]);

  return (
    <BulmaDropdown
      triggerButton={
        <BulmaButton
          isDisabled={isDisabled || !gistOverviewState.value?.length}
          isLoading={gistOverviewState.status === 'receiving'}
          onClick={toggleMenu}
        >
          <BulmaIcon definition={faCaretDown} isRightAligned>
            Select
          </BulmaIcon>
        </BulmaButton>
      }
      isActive={menu}
    >
      {gistOverviewState.value?.map(({id, gistName, description}) => (
        <OpenGistDropdownItem
          key={id}
          gistNameState={gistNameState}
          gistName={gistName}
          description={description}
        />
      ))}
    </BulmaDropdown>
  );
}
