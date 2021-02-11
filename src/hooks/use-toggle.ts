import {useCallback, useEffect, useState} from 'preact/hooks';

export function useToggle(timeout?: number): [boolean, () => void] {
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    if (!toggle || timeout === undefined) {
      return;
    }

    const timeoutId = setTimeout(() => setToggle(false), timeout);

    return () => clearTimeout(timeoutId);
  }, [timeout, toggle]);

  return [
    toggle,
    useCallback(() => setToggle((prevToggle) => !prevToggle), []),
  ];
}
