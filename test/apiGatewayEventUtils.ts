import { APIGatewayProxyEvent } from "aws-lambda";

export function apiGatewayEventWithBody(body: object): APIGatewayProxyEvent {
  return { body: JSON.stringify(body) } as unknown as APIGatewayProxyEvent;
}
