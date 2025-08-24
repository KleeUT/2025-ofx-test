import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { buildResponse, parseInput } from "./lib/apigateway";
import { createPayment, type Payment } from "./lib/payments";

type UserSuppliedPayment = Omit<Payment, "id">;

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const userSuppliedPayment = parseInput(
    event.body || "{}",
  ) as UserSuppliedPayment;
  const payment = {
    ...userSuppliedPayment,
    id: crypto.randomUUID(),
  };
  await createPayment(payment);
  return buildResponse(201, { result: payment.id });
};
