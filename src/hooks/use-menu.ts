import {JSX} from 'preact';
import {useCallback, useEffect, useMemo, useState} from 'preact/hooks';
import {toggle} from '../utils/toggle';

export interface Menu {
  readonly visible: boolean;
  readonly trigger: (event?: JSX.TargetedEvent) => void;
}

export function useMenu(): Menu {
  const [visible, setVisible] = useState(false);
  const toggleMenu = useCallback(() => setVisible(toggle), []);

  const trigger = useCallback((event?: JSX.TargetedEvent) => {
    toggleMenu();
    event?.stopPropagation();
  }, []);

  useEffect(() => {
    if (!visible) {
      return;
    }

    document.addEventListener('click', toggleMenu);

    return () => document.removeEventListener('click', toggleMenu);
  }, [visible]);

  return useMemo(() => ({visible, trigger}), [visible]);
}
