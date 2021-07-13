import {APIGatewayEvent, APIGatewayProxyResult} from 'aws-lambda';
import fetch from 'node-fetch';
import {getLambdaParam} from '../utils/get-lambda-param';
import {parseTitle} from '../utils/parse-title';

export async function handler(
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> {
  let html = '';

  try {
    const response = await fetch(getLambdaParam(event, 'url')!, {
      headers: {Accept: 'text/html'},
    });

    if (response.status === 200) {
      html = await response.text();
    }
  } catch {}

  return {
    statusCode: 200,
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(parseTitle(html)),
  };
}