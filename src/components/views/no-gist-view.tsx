import {
  BulmaButton,
  BulmaColumn,
  BulmaColumnBreakpointSizes,
  BulmaColumns,
  BulmaField,
  BulmaHero,
  BulmaIcon,
  BulmaText,
  BulmaTitle,
} from '@clebert/bulma-preact';
import {faEdit, faExclamationTriangle} from '@fortawesome/free-solid-svg-icons';
import {Fragment, JSX, h} from 'preact';
import {useCallback, useMemo, useState} from 'preact/hooks';
import {GistRestApi} from '../../apis/gist-rest-api';
import {UnsetGistNameState} from '../../hooks/use-gist-name';
import {
  GistOverviewDependencies,
  useGistOverview,
} from '../../hooks/use-gist-overview';
import {useSender} from '../../hooks/use-sender';
import {assertIsString} from '../../utils/assert-is-string';
import {toggle} from '../../utils/toggle';
import {OpenGistDropdown} from '../dropdowns/open-gist-dropdown';
import {CreateGistModal} from '../modals/create-gist-modal';
import {OpenGistModal} from '../modals/open-gist-modal';

export interface NoGistViewProps extends GistOverviewDependencies {
  readonly gistNameState: UnsetGistNameState;
}

const appBaseUrl = process.env.APP_BASE_URL;

assertIsString(appBaseUrl, 'process.env.APP_BASE_URL');

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
          [`.${appName}.md`]: `# This gist is maintained via [${appName}](${appBaseUrl})`,
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

  const gistOverviewState = useGistOverview({authState});

  if (gistOverviewState.status === 'failed') {
    return (
      <BulmaText color="danger">
        <BulmaIcon definition={faExclamationTriangle}>
          Oops! Could not load the list of existing gists.
        </BulmaIcon>
      </BulmaText>
    );
  }

  if (creationState.status === 'failed') {
    return (
      <BulmaText color="danger">
        <BulmaIcon definition={faExclamationTriangle}>
          Oops! Could not create a new gist.
        </BulmaIcon>
      </BulmaText>
    );
  }

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
          <BulmaHero color="primary" isBold>
            <BulmaTitle size="4">Open an existing gist.</BulmaTitle>

            <BulmaField isGrouped>
              <OpenGistDropdown
                gistNameState={gistNameState}
                gistOverviewState={gistOverviewState}
                isDisabled={creationState.status === 'sending'}
              />

              <BulmaButton
                isDisabled={creationState.status === 'sending'}
                onClick={toggleOpenModal}
              >
                <BulmaIcon definition={faEdit}>Enter URL</BulmaIcon>
              </BulmaButton>
            </BulmaField>
          </BulmaHero>
        </BulmaColumn>

        <BulmaColumn breakpointSizes={breakpointSizes}>
          <BulmaHero color="info" isBold>
            <BulmaTitle size="4">Create a new gist.</BulmaTitle>

            <BulmaButton
              isDisabled={creationState.status === 'sending'}
              onClick={toggleCreateModal}
            >
              <BulmaIcon definition={faEdit}>Enter description</BulmaIcon>
            </BulmaButton>
          </BulmaHero>
        </BulmaColumn>
      </BulmaColumns>
    </>
  );
}
