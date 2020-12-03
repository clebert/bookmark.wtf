import {BulmaButton, BulmaField, BulmaIcon} from '@clebert/bulma-react';
import {faGithub} from '@fortawesome/free-brands-svg-icons';
import {faTimes} from '@fortawesome/free-solid-svg-icons';
import * as React from 'react';
import {SetGistNameState} from '../../hooks/use-gist-name';

export interface CloseGistButtonProps {
  readonly gistNameState: SetGistNameState;
}

export function CloseGistButton({
  gistNameState,
}: CloseGistButtonProps): JSX.Element {
  const viewOnGithub = React.useCallback(
    () =>
      (window.location.href =
        'https://gist.github.com/' + gistNameState.gistName),
    [gistNameState]
  );

  const closeGist = React.useCallback(
    () => gistNameState.setGistName(undefined),
    [gistNameState]
  );

  return (
    <BulmaField hasAddons>
      <BulmaButton
        color="link"
        size="small"
        isLight
        isRounded
        onClick={viewOnGithub}
      >
        <BulmaIcon definition={faGithub}>View on GitHub</BulmaIcon>
      </BulmaButton>

      <BulmaButton size="small" isRounded onClick={closeGist}>
        <BulmaIcon definition={faTimes}>Close gist</BulmaIcon>
      </BulmaButton>
    </BulmaField>
  );
}
