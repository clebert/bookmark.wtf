import {BulmaDropdownItem} from '@clebert/bulma-preact';
import {JSX, h} from 'preact';
import {useCallback} from 'preact/hooks';
import {UnsetGistNameState} from '../../hooks/use-gist-name';

export interface OpenGistDropdownItemProps {
  readonly gistNameState: UnsetGistNameState;
  readonly gistName: string;
  readonly description: string | undefined;
}

export function OpenGistDropdownItem({
  gistNameState,
  gistName,
  description,
}: OpenGistDropdownItemProps): JSX.Element {
  const openGist = useCallback(() => gistNameState.setGistName(gistName), [
    gistName,
  ]);

  return (
    <BulmaDropdownItem onClick={openGist}>
      {description || gistName}
    </BulmaDropdownItem>
  );
}
