import {BulmaTitle} from '@clebert/bulma-react/lib/bulma-title';
import React from 'react';
import {assertIsString} from '../utils/assert-is-string';

const appName = process.env.APP_NAME;

assertIsString(appName, 'process.env.APP_NAME');

export function AppName(): JSX.Element {
  return <BulmaTitle size="3">{appName}</BulmaTitle>;
}
