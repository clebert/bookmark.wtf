import {JSX, h} from 'preact';

export interface IconProps {
  readonly type:
    | 'check'
    | 'gridAdd'
    | 'login'
    | 'logout'
    | 'pencil'
    | 'trash'
    | 'x';
}

export function Icon({type}: IconProps): JSX.Element {
  return (
    <div class="inline-flex h-5 align-middle mr-1">
      <svg
        class="stroke-current stroke-1 w-4 h-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        {type === 'check' && <path d="M5 13l4 4L19 7" />}

        {type === 'gridAdd' && (
          <path d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z" />
        )}

        {type === 'login' && (
          <path d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
        )}

        {type === 'logout' && (
          <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        )}

        {type === 'pencil' && (
          <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        )}

        {type === 'trash' && (
          <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        )}

        {type === 'x' && <path d="M6 18L18 6M6 6l12 12" />}
      </svg>
    </div>
  );
}
