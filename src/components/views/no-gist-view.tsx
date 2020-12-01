import {BulmaButton} from '@clebert/bulma-react/lib/bulma-button';
import {
  BulmaColumn,
  BulmaColumnBreakpointSizes,
} from '@clebert/bulma-react/lib/bulma-column';
import {BulmaColumns} from '@clebert/bulma-react/lib/bulma-columns';
import {BulmaField} from '@clebert/bulma-react/lib/bulma-field';
import {BulmaHero} from '@clebert/bulma-react/lib/bulma-hero';
import {BulmaTitle} from '@clebert/bulma-react/lib/bulma-title';
import React from 'react';
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
  const [createModal, setCreateModal] = React.useState(false);
  const toggleCreateModal = React.useCallback(() => setCreateModal(toggle), []);
  const [openModal, setOpenModal] = React.useState(false);
  const toggleOpenModal = React.useCallback(() => setOpenModal(toggle), []);
  const creationState = useSender();
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
