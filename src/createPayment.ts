import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { buildResponse, parseInput } from "./lib/apigateway";
import { createPayment, type Payment } from "./lib/payments";
import { availableCurrencies } from "./currencies";
import { validate, Validators } from "./utils/requestValidation";

type UserSuppliedPayment = Omit<Payment, "id">;

const validators: Validators = {
  amount: (val) => {
    if (typeof val === "number" && val > 0) {
      return { valid: true };
    }
    return {
      valid: false,
      error: { path: "amount", error: "Amount must be greater than 0" },
    };
  },
  currency: (val) => {
    if (typeof val === "string" && availableCurrencies.includes(val)) {
      return { valid: true };
    }
    return {
      valid: false,
      error: { path: "currency", error: `Currency ${val} is not supported` },
    };
  },
};

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

  const errors = validate(userSuppliedPayment, validators);
  if (errors.length > 0) {
    // here I'm opting to include the issues with the offending properties because it makes it easier for consumers
    // depending on the intended consumers we may want to restrict these details to staging to avoid exposing implementation details
    return buildResponse(422, { errors });
  }

  await createPayment(payment);

  return buildResponse(201, { result: payment.id });
};
