import {StateUpdater, useEffect, useState} from 'preact/hooks';

export function useConfirmation(): [boolean, StateUpdater<boolean>] {
  const state = useState(false);

  useEffect(() => {
    if (!state[0]) {
      return;
    }

    const timeoutId = setTimeout(() => state[1](false), 3000);

    return () => clearTimeout(timeoutId);
  }, [state[0]]);

  return state;
}
