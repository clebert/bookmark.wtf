import * as React from 'react';

export function Page({children}: React.PropsWithChildren): JSX.Element {
  return (
    <div className="2xl:container 2xl:mx-auto">
      <div className="flex flex-col m-4 space-y-4">{children}</div>
    </div>
  );
}
