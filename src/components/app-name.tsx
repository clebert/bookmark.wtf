import React from 'react';
import {BulmaTitle} from '../bulma/bulma-title';
import {assertIsString} from '../utils/assert-is-string';

const appName = process.env.APP_NAME;

assertIsString(appName, 'process.env.APP_NAME');

export function AppName(): JSX.Element {
  return <BulmaTitle size="3">{appName}</BulmaTitle>;
}
