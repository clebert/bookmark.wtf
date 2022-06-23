import equal from 'fast-deep-equal';
import type {JSX} from 'preact';
import {useCallback, useMemo} from 'preact/hooks';
import {AppTopics} from '../pub-sub/app-topics.js';
import type {Bookmark} from '../utils/parse-bookmark.js';
import {Button} from './button.js';
import {Icon} from './icon.js';

export interface CopyBookmarkButtonProps {
  readonly bookmark: Bookmark;
}

export function CopyBookmarkButton({
  bookmark,
}: CopyBookmarkButtonProps): JSX.Element {
  const otherBookmark = AppTopics.bookmark.use();

  const copy = useCallback(
    () => AppTopics.bookmark.publish(bookmark),
    [bookmark],
  );

  const copied = useMemo(
    () => equal(JSON.parse(JSON.stringify(bookmark)), otherBookmark),
    [bookmark, otherBookmark],
  );

  return (
    <Button
      class="CopyBookmarkButton"
      title={copied ? `Bookmark copied` : `Copy bookmark`}
      disabled={copied}
      onClick={copy}
    >
      <Icon type={copied ? `clipboardCheck` : `clipboardCopy`} standalone />
    </Button>
  );
}
