import * as payments from "../src/lib/payments";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const paymentId = event.pathParameters?.id;
  if (!paymentId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing payment ID" }),
    };
  }
  const payment = await payments.getPayment(paymentId);

  if (payment === null) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: "Payment not found" }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(payment),
  };
};
