import {BulmaButton, BulmaField, BulmaIcon} from '@clebert/bulma-preact';
import {faGithub} from '@fortawesome/free-brands-svg-icons';
import {faTimes} from '@fortawesome/free-solid-svg-icons';
import {JSX, h} from 'preact';
import {useCallback} from 'preact/hooks';
import {SetGistSelection} from '../../hooks/use-gist-selection';

export interface CloseGistButtonProps {
  readonly gistSelection: SetGistSelection;
}

export function CloseGistButton({
  gistSelection,
}: CloseGistButtonProps): JSX.Element {
  const viewOnGithub = useCallback(
    () =>
      (window.location.href =
        'https://gist.github.com/' + gistSelection.gistName),
    [gistSelection]
  );

  const closeGist = useCallback(() => gistSelection.setGistName(undefined), []);

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
