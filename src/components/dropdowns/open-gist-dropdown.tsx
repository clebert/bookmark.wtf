import {BulmaButton, BulmaDropdown, BulmaIcon} from '@clebert/bulma-preact';
import {faAngleDown, faAngleUp} from '@fortawesome/free-solid-svg-icons';
import {JSX, h} from 'preact';
import {UnsetGistNameState} from '../../hooks/use-gist-name';
import {
  GistOverviewDependencies,
  useGistOverview,
} from '../../hooks/use-gist-overview';
import {useMenu} from '../../hooks/use-menu';
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
  const {visible, trigger} = useMenu();

  return (
    <BulmaDropdown
      triggerButton={
        <BulmaButton
          isDisabled={isDisabled || !gistOverviewState.value?.length}
          isLoading={gistOverviewState.status === 'receiving'}
          onClick={trigger}
        >
          <BulmaIcon
            definition={visible ? faAngleUp : faAngleDown}
            isRightAligned
          >
            Select
          </BulmaIcon>
        </BulmaButton>
      }
      isActive={visible}
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
