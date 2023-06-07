import * as React from 'react';

export function Grid({children}: React.PropsWithChildren): JSX.Element {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {children}
    </div>
  );
}
