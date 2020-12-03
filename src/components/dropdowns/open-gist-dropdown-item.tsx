import {BulmaDropdownItem} from '@clebert/bulma-react';
import * as React from 'react';
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
  const openGist = React.useCallback(
    () => gistNameState.setGistName(gistName),
    [gistName]
  );

  return (
    <BulmaDropdownItem onClick={openGist}>
      {description || gistName}
    </BulmaDropdownItem>
  );
}
