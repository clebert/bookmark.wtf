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
import {useCallback, useEffect, useRef, useState} from 'preact/hooks';
import {BookmarkInit} from '../../hooks/use-bookmark-init';
import {useInputCallback} from '../../hooks/use-input-callback';
import {Bookmarklet} from '../../utils/create-bookmarklet';
import {preventDefault} from '../../utils/prevent-default';

export interface AddBookmarkModalProps {
  readonly bookmarklet: Bookmarklet;
  readonly bookmarkInit: BookmarkInit | undefined;

  onCreateBookmark(title: string, url: string): void;
  onCancel(): void;
}

export function AddBookmarkModal({
  bookmarklet,
  bookmarkInit,
  onCreateBookmark,
  onCancel,
}: AddBookmarkModalProps): JSX.Element {
  const [title, setTitle] = useState(bookmarkInit?.title ?? '');
  const [url, setUrl] = useState(bookmarkInit?.url ?? '');

  const createBookmark = useCallback(
    preventDefault(() => onCreateBookmark(title, url)),
    [onCreateBookmark, title, url]
  );

  const addBookmarkTagRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (addBookmarkTagRef.current) {
      addBookmarkTagRef.current.setAttribute('href', bookmarklet.url);
    }
  });

  const nop = useCallback(preventDefault(), []);

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

        {bookmarkInit && bookmarkInit.version !== bookmarklet.version && (
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

        {!bookmarkInit && (
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
