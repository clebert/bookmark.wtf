import {ComponentChildren, JSX, h} from 'preact';
import {useCallback} from 'preact/hooks';
import {join} from '../utils/join';
import {Theme} from '../utils/theme';

export interface LinkProps {
  readonly children: ComponentChildren;
  readonly url: string;
  readonly theme?: Theme;

  onClick(): void;
}

export function Link({
  children,
  url,
  theme = Theme.link(),
  onClick,
}: LinkProps): JSX.Element {
  return (
    <a
      href={url}
      onClick={useCallback(
        (event: Event) => {
          event.preventDefault();
          onClick();
        },
        [onClick]
      )}
      class={join([
        theme.textColor,
        Theme.activeTextColor,
        Theme.outlineColor,
        Theme.normalFont,
        'border',
        'border-transparent',
        'overflow-hidden',
        'overflow-ellipsis',
        'hover:underline',
        'whitespace-nowrap',
      ])}
    >
      {children}
    </a>
  );
}
