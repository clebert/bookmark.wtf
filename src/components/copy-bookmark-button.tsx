import equal from 'fast-deep-equal';
import {JSX} from 'preact';
import {useCallback, useMemo} from 'preact/hooks';
import {AppStorage} from '../pub-sub/app-storage';
import {Bookmark} from '../utils/parse-bookmark';
import {Button} from './button';
import {Icon} from './icon';

export interface CopyBookmarkButtonProps {
  readonly bookmark: Bookmark;
}

export function CopyBookmarkButton({
  bookmark,
}: CopyBookmarkButtonProps): JSX.Element {
  const otherBookmark = AppStorage.singleton.useBookmark();

  const copy = useCallback(
    () => AppStorage.singleton.setBookmark(bookmark),
    [bookmark]
  );

  const copied = useMemo(
    () => equal(JSON.parse(JSON.stringify(bookmark)), otherBookmark),
    [bookmark, otherBookmark]
  );

  return (
    <Button
      class="CopyBookmarkButton"
      title={copied ? 'Bookmark copied' : 'Copy bookmark'}
      disabled={copied}
      onClick={copy}
    >
      <Icon type={copied ? 'clipboardCheck' : 'clipboardCopy'} standalone />
    </Button>
  );
}
