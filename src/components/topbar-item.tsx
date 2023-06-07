import * as React from 'react';

export function TopbarItem({children}: React.PropsWithChildren): JSX.Element {
  return <div className="flex items-center space-x-2">{children}</div>;
}
