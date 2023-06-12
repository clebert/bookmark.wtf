import * as React from 'react';

export function useToggle(initialValue: boolean, timeout?: number): [boolean, () => void] {
  const [toggle, setToggle] = React.useState(initialValue);

  React.useEffect(() => {
    if (!toggle || timeout === undefined) {
      return;
    }

    const timeoutId = setTimeout(() => setToggle(false), timeout);

    return () => clearTimeout(timeoutId);
  }, [timeout, toggle]);

  return [toggle, React.useCallback(() => setToggle((prevToggle) => !prevToggle), [])];
}
