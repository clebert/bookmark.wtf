import {BulmaTitle} from '@clebert/bulma-preact';
import {JSX, h} from 'preact';
import {assertIsString} from '../utils/assert-is-string';

const appName = process.env.APP_NAME;

assertIsString(appName, 'process.env.APP_NAME');

export function AppName(): JSX.Element {
  return <BulmaTitle size="3">{appName}</BulmaTitle>;
}
