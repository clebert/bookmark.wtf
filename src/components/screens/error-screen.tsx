import {BulmaHero} from '@clebert/bulma-react/lib/bulma-hero';
import {BulmaIcon} from '@clebert/bulma-react/lib/bulma-icon';
import {BulmaLevel} from '@clebert/bulma-react/lib/bulma-level';
import {BulmaTitle} from '@clebert/bulma-react/lib/bulma-title';
import {faBomb} from '@fortawesome/free-solid-svg-icons';
import React from 'react';
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
