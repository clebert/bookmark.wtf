import * as React from 'react';

export function useTimer(
  duration: number,
  startTime: number | undefined,
): boolean {
  const active = Date.now() - (startTime ?? 0) < duration;
  const [, rerender] = React.useState({});

  React.useEffect(() => {
    if (!active) {
      return;
    }

    const timeoutId = setTimeout(() => rerender({}), duration);

    return () => clearTimeout(timeoutId);
  }, [duration, startTime]);

  return active;
}
