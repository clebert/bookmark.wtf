import {
  BulmaButton,
  BulmaColumn,
  BulmaColumnBreakpointSizes,
  BulmaColumns,
  BulmaField,
  BulmaHero,
  BulmaTitle,
} from '@clebert/bulma-preact';
import {Fragment, JSX, h} from 'preact';
import {useCallback, useMemo, useState} from 'preact/hooks';
import {GistRestApi} from '../../apis/gist-rest-api';
import {AuthorizedAuthState} from '../../hooks/use-auth';
import {UnsetGistNameState} from '../../hooks/use-gist-name';
import {useSender} from '../../hooks/use-sender';
import {assertIsString} from '../../utils/assert-is-string';
import {toggle} from '../../utils/toggle';
import {OpenGistDropdown} from '../dropdowns/open-gist-dropdown';
import {CreateGistModal} from '../modals/create-gist-modal';
import {OpenGistModal} from '../modals/open-gist-modal';

export interface NoGistViewProps {
  readonly authState: AuthorizedAuthState;
  readonly gistNameState: UnsetGistNameState;
}

const appUrl = process.env.APP_URL;

assertIsString(appUrl, 'process.env.APP_URL');

const appName = process.env.APP_NAME;

assertIsString(appName, 'process.env.APP_NAME');

const breakpointSizes: BulmaColumnBreakpointSizes = {
  tablet: '12',
  desktop: '6',
};

export function NoGistView({
  authState,
  gistNameState,
}: NoGistViewProps): JSX.Element {
  const [createModal, setCreateModal] = useState(false);
  const toggleCreateModal = useCallback(() => setCreateModal(toggle), []);
  const [openModal, setOpenModal] = useState(false);
  const toggleOpenModal = useCallback(() => setOpenModal(toggle), []);
  const creationState = useSender();
  const restApi = useMemo(() => new GistRestApi(authState.token), []);

  const createGist = useCallback(
    (description: string) => {
      creationState.send?.(
        restApi.createGist(description, {
          [`.${appName}.md`]: `# This gist is maintained via [${appName}](${appUrl})`,
        }),
        gistNameState.setGistName
      );

      setCreateModal(false);
    },
    [creationState]
  );

  const openGist = useCallback((gistName: string) => {
    gistNameState.setGistName(gistName);
    setOpenModal(false);
  }, []);

  return (
    <>
      {createModal && (
        <CreateGistModal
          onCreateGist={createGist}
          onCancel={toggleCreateModal}
        />
      )}

      {openModal && (
        <OpenGistModal onOpenGist={openGist} onCancel={toggleOpenModal} />
      )}

      <BulmaColumns isMultiline>
        <BulmaColumn breakpointSizes={breakpointSizes}>
          <BulmaHero color="dark" isBold>
            <BulmaTitle size="4">Open an existing gist.</BulmaTitle>

            <BulmaField isGrouped>
              <OpenGistDropdown
                authState={authState}
                gistNameState={gistNameState}
                isDisabled={creationState.status === 'sending'}
              />

              <BulmaButton
                isDisabled={creationState.status === 'sending'}
                onClick={toggleOpenModal}
              >
                Enter URL
              </BulmaButton>
            </BulmaField>
          </BulmaHero>
        </BulmaColumn>

        <BulmaColumn breakpointSizes={breakpointSizes}>
          <BulmaHero color="light" isBold>
            <BulmaTitle size="4">Create a new gist.</BulmaTitle>

            <BulmaButton
              isDisabled={creationState.status === 'sending'}
              onClick={toggleCreateModal}
            >
              Enter description
            </BulmaButton>
          </BulmaHero>
        </BulmaColumn>
      </BulmaColumns>
    </>
  );
}
