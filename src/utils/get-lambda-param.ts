import {APIGatewayEvent} from 'aws-lambda';

export function getLambdaParam(
  event: APIGatewayEvent,
  key: string
): string | undefined {
  const {queryStringParameters: params} = event;

  return (params && params[key]) || undefined;
}
