import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { buildResponse } from "./lib/apigateway";
import { constructPayments } from "./lib/payments";
import { DocumentClient } from "./lib/dynamodb";

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  // Reviewer note: Opting for a query parameter here over path parameters to enable extending this to other filtering options in the future
  const currency = event.queryStringParameters?.currency;
  const payments = constructPayments(DocumentClient);
  const data = await payments.listPayments(currency);
  return buildResponse(200, { data });
};
