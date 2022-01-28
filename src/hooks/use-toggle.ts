import {useCallback, useEffect, useState} from 'preact/hooks';

export function useToggle(
  initialValue: boolean,
  timeout?: number,
): [boolean, () => void] {
  const [toggle, setToggle] = useState(initialValue);

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
