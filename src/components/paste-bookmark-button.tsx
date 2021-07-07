import {JSX} from 'preact';
import {useMemo} from 'preact/hooks';
import {GistStore} from '../hooks/use-gist-store';
import {AppStorage} from '../pub-sub/app-storage';
import {createRandomValue} from '../utils/create-random-value';
import {serializeBookmark} from '../utils/serialize-bookmark';
import {Button} from './button';
import {Icon} from './icon';

export interface PasteBookmarkButtonProps {
  readonly gistStore: GistStore;
}

export function PasteBookmarkButton({
  gistStore,
}: PasteBookmarkButtonProps): JSX.Element {
  const bookmark = AppStorage.singleton.useBookmark();

  const paste = useMemo(() => {
    return 'createFile' in gistStore && bookmark
      ? () => {
          gistStore.createFile(
            createRandomValue() + '.md',
            serializeBookmark({...bookmark, mtime: Date.now()})
          );

          AppStorage.singleton.setBookmark(undefined);
        }
      : undefined;
  }, [gistStore, bookmark]);

  return (
    <Button
      class="PasteBookmarkButton"
      title="Paste bookmark"
      highlight={Boolean(bookmark)}
      onClick={paste}
    >
      <Icon type="clipboard" standalone />
    </Button>
  );
}
