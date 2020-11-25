import {faBomb} from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import {BulmaHero} from '../../bulma/bulma-hero';
import {BulmaIcon} from '../../bulma/bulma-icon';
import {BulmaLevel} from '../../bulma/bulma-level';
import {BulmaTitle} from '../../bulma/bulma-title';
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
