import {BulmaButton, BulmaField, BulmaIcon} from '@clebert/bulma-preact';
import {faGithub} from '@fortawesome/free-brands-svg-icons';
import {faTimes} from '@fortawesome/free-solid-svg-icons';
import {JSX, h} from 'preact';
import {useCallback} from 'preact/hooks';
import {SetGistNameState} from '../../hooks/use-gist-name';

export interface CloseGistButtonProps {
  readonly gistNameState: SetGistNameState;
}

export function CloseGistButton({
  gistNameState,
}: CloseGistButtonProps): JSX.Element {
  const viewOnGithub = useCallback(
    () =>
      (window.location.href =
        'https://gist.github.com/' + gistNameState.gistName),
    [gistNameState]
  );

  const closeGist = useCallback(() => gistNameState.setGistName(undefined), []);

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
