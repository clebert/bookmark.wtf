import React from 'react';

export function useConfirmation(): [
  boolean,
  React.Dispatch<React.SetStateAction<boolean>>
] {
  const state = React.useState(false);

  React.useEffect(() => {
    if (!state[0]) {
      return;
    }

    const timeoutId = setTimeout(() => state[1](false), 3000);

    return () => clearTimeout(timeoutId);
  }, [state[0]]);

  return state;
}
