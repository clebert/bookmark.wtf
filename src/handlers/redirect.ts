import type {APIGatewayEvent, APIGatewayProxyResult} from 'aws-lambda';

import {assertIsString} from '../utils/assert-is-string.js';
import {getLambdaCookie} from '../utils/get-lambda-cookie.js';
import {getLambdaParam} from '../utils/get-lambda-param.js';
import {z} from 'zod';

export async function handler(event: APIGatewayEvent): Promise<APIGatewayProxyResult> {
  const transactionId = getLambdaParam(event, `state`);

  if (!transactionId || transactionId !== getLambdaCookie(event, `transactionId`)) {
    throw new Error(`Untrusted OAuth transaction.`);
  }

  const url = new URL(`https://github.com/login/oauth/access_token`);
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const code = getLambdaParam(event, `code`);

  assertIsString(clientId, `process.env.CLIENT_ID`);
  assertIsString(clientSecret, `process.env.CLIENT_SECRET`);
  assertIsString(code, `code`);

  url.searchParams.set(`client_id`, clientId);
  url.searchParams.set(`client_secret`, clientSecret);
  url.searchParams.set(`code`, code);
  url.searchParams.set(`state`, transactionId);

  const response = await fetch(url.href, {headers: {Accept: `application/json`}});

  const body = z
    .object({message: z.string().optional(), access_token: z.string().optional()})
    .parse(await response.json());

  if (response.status !== 200 || !body.access_token) {
    throw new Error(`Fetching token failed: ${body.message}`);
  }

  const searchParams = new URLSearchParams();

  searchParams.set(`transactionId`, transactionId);
  searchParams.set(`token`, body.access_token);

  return {statusCode: 302, headers: {Location: `/?${searchParams.toString()}`}, body: ``};
}
