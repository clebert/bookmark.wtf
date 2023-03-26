import type {APIGatewayEvent, APIGatewayProxyResult} from 'aws-lambda';

import {getLambdaParam} from '../utils/get-lambda-param.js';
import {parseTitle} from '../utils/parse-title.js';
import fetch from 'node-fetch';

export async function handler(
  event: APIGatewayEvent,
): Promise<APIGatewayProxyResult> {
  let html = ``;

  try {
    const response = await fetch(getLambdaParam(event, `url`)!, {
      headers: {'Accept': `text/html`, 'User-Agent': `Mozilla/5.0 (Linux)`},
    });

    if (response.status === 200) {
      html = await response.text();
    }
  } catch {}

  return {
    statusCode: 200,
    headers: {'Content-Type': `application/json`},
    body: JSON.stringify(parseTitle(html)),
  };
}
