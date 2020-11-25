import React from 'react';
import {BulmaDropdownItem} from '../../bulma/bulma-dropdown-item';
import {UnsetGistNameState} from '../../hooks/use-gist-name-state';

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
