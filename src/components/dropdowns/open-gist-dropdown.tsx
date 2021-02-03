import {BulmaButton, BulmaDropdown, BulmaIcon} from '@clebert/bulma-preact';
import {faAngleDown, faAngleUp} from '@fortawesome/free-solid-svg-icons';
import {ReceivingReceiver, SuccessfulReceiver} from 'loxia';
import {JSX, h} from 'preact';
import {GistOverview} from '../../hooks/use-gist-overview-receiver';
import {UnsetGistSelection} from '../../hooks/use-gist-selection';
import {useMenu} from '../../hooks/use-menu';
import {OpenGistDropdownItem} from './open-gist-dropdown-item';

export interface OpenGistDropdownProps {
  readonly gistSelection: UnsetGistSelection;

  readonly gistOverviewReceiver:
    | ReceivingReceiver
    | SuccessfulReceiver<GistOverview>;

  readonly isDisabled: boolean;
}

export function OpenGistDropdown({
  gistSelection,
  gistOverviewReceiver,
  isDisabled,
}: OpenGistDropdownProps): JSX.Element {
  const {visible, trigger} = useMenu();

  return (
    <BulmaDropdown
      triggerButton={
        <BulmaButton
          isDisabled={isDisabled || !gistOverviewReceiver.value?.length}
          isLoading={gistOverviewReceiver.state === 'receiving'}
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
      {gistOverviewReceiver.value?.map(({id, gistName, description}) => (
        <OpenGistDropdownItem
          key={id}
          gistSelection={gistSelection}
          gistName={gistName}
          description={description}
        />
      ))}
    </BulmaDropdown>
  );
}
