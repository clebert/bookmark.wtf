import type {app} from '../state-machines/app.js';
import type {Bookmark} from '../utils/parse-bookmark.js';
import type {InferSnapshot} from 'state-guard';

import {BookmarkIcon} from './bookmark-icon.js';
import {DeleteButton} from './delete-button.js';
import {EditBookmarkForm} from './edit-bookmark-form.js';
import {EditButton} from './edit-button.js';
import {GridItem} from './grid-item.js';
import {Icon} from './icon.js';
import {Link} from './link.js';
import {useToggle} from '../hooks/use-toggle.js';
import {uiMode} from '../state-machines/ui-mode.js';
import {serializeBookmark} from '../utils/serialize-bookmark.js';
import * as React from 'react';

export interface BookmarkItemProps {
  appSnapshot: InferSnapshot<
    typeof app,
    'hasGist' | 'isUpdatingGist' | 'hasForeignGist' | 'isForkingGist'
  >;

  bookmarkFile: BookmarkFile;
}

export interface BookmarkFile {
  readonly filename: string;
  readonly bookmark: Bookmark;
}

export function BookmarkItem({appSnapshot, bookmarkFile}: BookmarkItemProps): JSX.Element {
  const {token, user, gistName, gist} = appSnapshot.value;
  const {filename, bookmark} = bookmarkFile;

  const openBookmark = React.useCallback(() => {
    if (!window.navigator.userAgent.includes(`Firefox`) && appSnapshot.state === `hasGist`) {
      const operation = {
        type: `updateFile`,
        filename,
        content: serializeBookmark({...bookmark, clickCount: (bookmark.clickCount ?? 0) + 1}),
      } as const;

      appSnapshot.actions.updateGist({token, user, gistName, gist, operation});
    }

    window.location.href = bookmark.url;
  }, [appSnapshot]);

  const [editing, toggleEditing] = useToggle(false);

  const updateBookmark = React.useMemo(
    () =>
      appSnapshot.state === `hasGist`
        ? (title: string, url: string) => {
            const operation = {
              type: `updateFile`,
              filename,
              content: serializeBookmark({...bookmark, title, url}),
            } as const;

            appSnapshot.actions.updateGist({token, user, gistName, gist, operation});
            toggleEditing();
          }
        : undefined,
    [appSnapshot],
  );

  const [deleting, toggleDeleting] = useToggle(false, 3000);

  const deleteBookmark = React.useMemo(
    () =>
      appSnapshot.state === `hasGist`
        ? () => {
            const operation = {type: `deleteFile`, filename} as const;

            appSnapshot.actions.updateGist({token, user, gistName, gist, operation});
            toggleDeleting();
          }
        : undefined,
    [appSnapshot],
  );

  const isShowingControls = React.useSyncExternalStore(uiMode.subscribe, () =>
    uiMode.get(`isShowingControls`),
  );

  return editing ? (
    <EditBookmarkForm
      initialTitle={bookmark.title}
      initialUrl={bookmark.url}
      onCancel={toggleEditing}
      onUpdate={updateBookmark}
    />
  ) : (
    <GridItem
      leftCol={
        <BookmarkIcon key={bookmark.url} initialLinkUrl={bookmark.url} onClick={openBookmark} />
      }
      row1={
        <Link url={bookmark.url} onClick={openBookmark}>
          <Icon type="externalLink" />
          {bookmark.title}
        </Link>
      }
      row2={
        isShowingControls &&
        (deleting ? (
          <>
            <EditButton targetName="bookmark" />
            <DeleteButton targetName="bookmark" verbose action={deleteBookmark} />
          </>
        ) : (
          <>
            <EditButton
              targetName="bookmark"
              action={appSnapshot.state === `hasGist` ? toggleEditing : undefined}
            />

            <DeleteButton
              targetName="bookmark"
              action={appSnapshot.state === `hasGist` ? toggleDeleting : undefined}
            />
          </>
        ))
      }
    />
  );
}
