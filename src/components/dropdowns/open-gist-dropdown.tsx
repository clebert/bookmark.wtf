import {BulmaButton, BulmaDropdown, BulmaIcon} from '@clebert/bulma-preact';
import {faAngleDown, faAngleUp} from '@fortawesome/free-solid-svg-icons';
import {JSX, h} from 'preact';
import {useCallback, useEffect, useState} from 'preact/hooks';
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
  const [menu, setMenu] = useState(false);
  const toggleMenu = useCallback(() => setMenu(toggle), []);

  const trigger = useCallback((event: JSX.TargetedEvent) => {
    toggleMenu();
    event.stopPropagation();
  }, []);

  useEffect(() => {
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
