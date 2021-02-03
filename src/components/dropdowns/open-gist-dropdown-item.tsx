import {BulmaDropdownItem} from '@clebert/bulma-preact';
import {JSX, h} from 'preact';
import {useCallback} from 'preact/hooks';
import {UnsetGistSelection} from '../../hooks/use-gist-selection';

export interface OpenGistDropdownItemProps {
  readonly gistSelection: UnsetGistSelection;
  readonly gistName: string;
  readonly description: string | undefined;
}

export function OpenGistDropdownItem({
  gistSelection,
  gistName,
  description,
}: OpenGistDropdownItemProps): JSX.Element {
  const openGist = useCallback(() => gistSelection.setGistName(gistName), [
    gistName,
  ]);

  return (
    <BulmaDropdownItem onClick={openGist}>
      {description || gistName}
    </BulmaDropdownItem>
  );
}
