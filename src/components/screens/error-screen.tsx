import {
  BulmaHero,
  BulmaIcon,
  BulmaLevel,
  BulmaTitle,
} from '@clebert/bulma-react';
import {faBomb} from '@fortawesome/free-solid-svg-icons';
import * as React from 'react';
import {AppName} from '../app-name';

export function ErrorScreen(): JSX.Element {
  return (
    <>
      <BulmaLevel items={[<AppName />]} />

      <BulmaHero color="danger" size="medium" isBold>
        <BulmaTitle size="3">
          <BulmaIcon definition={faBomb} size="large">
            Oops! Something went wrong.
          </BulmaIcon>
        </BulmaTitle>
      </BulmaHero>
    </>
  );
}
