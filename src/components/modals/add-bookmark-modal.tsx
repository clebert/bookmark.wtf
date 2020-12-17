import {
  BulmaButton,
  BulmaContent,
  BulmaField,
  BulmaIcon,
  BulmaInput,
  BulmaModalCard,
  BulmaTag,
  BulmaText,
} from '@clebert/bulma-preact';
import {faExclamationTriangle, faPlus} from '@fortawesome/free-solid-svg-icons';
import {JSX, h} from 'preact';
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'preact/hooks';
import {HistoryContext} from '../../hooks/use-history';
import {useInputCallback} from '../../hooks/use-input-callback';
import {Bookmarklet} from '../../utils/create-bookmarklet';

export interface AddBookmarkModalProps {
  readonly bookmarklet: Bookmarklet;

  onCreateBookmark(title: string, url: string): void;
  onCancel(): void;
}

export function AddBookmarkModal({
  bookmarklet,
  onCreateBookmark,
  onCancel,
}: AddBookmarkModalProps): JSX.Element {
  const history = useContext(HistoryContext);
  const {searchParams} = useMemo(() => new URL(history.url), []);
  const initialTitle = useMemo(() => searchParams.get('title') ?? '', []);
  const initialUrl = useMemo(() => searchParams.get('url') ?? '', []);
  const initialVersion = useMemo(() => searchParams.get('version') ?? '', []);
  const [title, setTitle] = useState(initialTitle);
  const [url, setUrl] = useState(initialUrl);

  useEffect(
    () =>
      history.scheduleUpdate(
        'replace',
        {type: 'param', key: 'title'},
        {type: 'param', key: 'url'},
        {type: 'param', key: 'version'}
      ),
    []
  );

  const createBookmark = useCallback(
    (event: JSX.TargetedEvent) => {
      onCreateBookmark(title, url);
      event.preventDefault();
    },
    [onCreateBookmark, title, url]
  );

  const addBookmarkTagRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (addBookmarkTagRef.current) {
      addBookmarkTagRef.current.setAttribute('href', bookmarklet.url);
    }
  });

  const nop = useCallback(
    (event: JSX.TargetedEvent) => event.preventDefault(),
    []
  );

  return (
    <form onSubmit={createBookmark}>
      <BulmaModalCard
        title="Add a new bookmark."
        footer={
          <BulmaField isGrouped>
            <BulmaButton type="submit" color="success">
              Create bookmark
            </BulmaButton>

            <BulmaButton color="text" onClick={onCancel}>
              Cancel
            </BulmaButton>
          </BulmaField>
        }
        onBackgroundClick={onCancel}
      >
        <BulmaField>
          <BulmaInput
            placeholder="Enter title"
            value={title}
            isAutoFocused
            isRequired
            onChange={useInputCallback(setTitle)}
          />
        </BulmaField>

        <BulmaField>
          <BulmaInput
            type="url"
            placeholder="Enter URL"
            value={url}
            isRequired
            onChange={useInputCallback(setUrl)}
          />
        </BulmaField>

        {initialUrl && initialVersion !== bookmarklet.version && (
          <BulmaContent>
            <BulmaText color="danger">
              <BulmaIcon definition={faExclamationTriangle}>
                Your bookmarklet is out of date. Please replace it with the
                latest version:{' '}
                <BulmaTag
                  ref={addBookmarkTagRef}
                  color="link"
                  isLight
                  isRounded
                  onClick={nop}
                >
                  <BulmaIcon definition={faPlus}>Add bookmark</BulmaIcon>
                </BulmaTag>
              </BulmaIcon>
            </BulmaText>
          </BulmaContent>
        )}

        {!initialUrl && (
          <BulmaContent isHidden="touch">
            <b>Tip: </b>You can save the bookmarklet{' '}
            <BulmaTag
              ref={addBookmarkTagRef}
              color="link"
              isLight
              isRounded
              onClick={nop}
            >
              <BulmaIcon definition={faPlus}>Add bookmark</BulmaIcon>
            </BulmaTag>{' '}
            in the Favorites bar of your browser. This allows you to add new
            bookmarks without having to enter the title and URL yourself.
          </BulmaContent>
        )}
      </BulmaModalCard>
    </form>
  );
}
