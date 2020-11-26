import React from 'react';
import {GistRestApi} from '../../apis/gist-rest-api';
import {BulmaButton} from '../../bulma/bulma-button';
import {
  BulmaColumn,
  BulmaColumnBreakpointSizes,
} from '../../bulma/bulma-column';
import {BulmaColumns} from '../../bulma/bulma-columns';
import {BulmaField} from '../../bulma/bulma-field';
import {BulmaHero} from '../../bulma/bulma-hero';
import {BulmaTitle} from '../../bulma/bulma-title';
import {AuthorizedAuthState} from '../../hooks/use-auth-state';
import {UnsetGistNameState} from '../../hooks/use-gist-name-state';
import {useSenderState} from '../../hooks/use-sender-state';
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
  const [createModal, setCreateModal] = React.useState(false);
  const toggleCreateModal = React.useCallback(() => setCreateModal(toggle), []);
  const [openModal, setOpenModal] = React.useState(false);
  const toggleOpenModal = React.useCallback(() => setOpenModal(toggle), []);
  const creationState = useSenderState();
  const restApi = React.useMemo(() => new GistRestApi(authState.token), []);

  const createGist = React.useCallback(
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

  const openGist = React.useCallback((gistName: string) => {
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
