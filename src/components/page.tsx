import * as React from 'react';

export function Page({children}: React.PropsWithChildren): JSX.Element {
  return (
    <div className="2xl:container 2xl:mx-auto">
      <div className="m-4 flex flex-col space-y-4">{children}</div>
    </div>
  );
}
