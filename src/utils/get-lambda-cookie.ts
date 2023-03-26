import type {APIGatewayEvent} from 'aws-lambda';

import cookie from 'cookie';

export function getLambdaCookie(
  event: APIGatewayEvent,
  key: string,
): string | undefined {
  const {headers} = event;

  return headers.cookie ? cookie.parse(headers.cookie)[key] : undefined;
}
