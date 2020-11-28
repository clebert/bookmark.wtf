import {faAngleDown, faAngleUp} from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import {BulmaButton} from '../../bulma/bulma-button';
import {BulmaDropdown} from '../../bulma/bulma-dropdown';
import {BulmaIcon} from '../../bulma/bulma-icon';
import {UnsetGistNameState} from '../../hooks/use-gist-name';
import {
  GistOverviewDependencies,
  useGistOverview,
} from '../../hooks/use-gist-overview';
import {toggle} from '../../utils/toggle';
import {OpenGistDropdownItem} from './open-gist-dropdown-item';

export interface OpenGistDropdownProps extends GistOverviewDependencies {
  readonly gistNameState: UnsetGistNameState;
  readonly isDisabled: boolean;
}

export function OpenGistDropdown({
  authState,
  gistNameState,
  isDisabled,
}: OpenGistDropdownProps): JSX.Element {
  const gistOverviewState = useGistOverview({authState});
  const [menu, setMenu] = React.useState(false);
  const toggleMenu = React.useCallback(() => setMenu(toggle), []);

  const trigger = React.useCallback((event: React.MouseEvent) => {
    toggleMenu();
    event.stopPropagation();
  }, []);

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
          onClick={trigger}
        >
          <BulmaIcon definition={menu ? faAngleUp : faAngleDown} isRightAligned>
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
