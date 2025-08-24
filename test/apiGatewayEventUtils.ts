import { APIGatewayProxyEvent } from "aws-lambda";

export function apiGatewayEventWithBody(body: Object): APIGatewayProxyEvent {
  return { body: JSON.stringify(body) } as unknown as APIGatewayProxyEvent;
}
