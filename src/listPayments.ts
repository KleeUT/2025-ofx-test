import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { buildResponse } from "./lib/apigateway";
import { constructPayments } from "./lib/payments";
import { DocumentClient } from "./lib/dynamodb";

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const payments = constructPayments(DocumentClient);
  const data = await payments.listPayments();
  return buildResponse(200, { data });
};
