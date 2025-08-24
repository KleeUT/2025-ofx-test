import { APIGatewayProxyEvent } from "aws-lambda";
import * as payments from "../src/lib/payments";
import { handler } from "../src/listPayments";

const listPaymentsMock = jest.fn();
jest.mock("../src/lib/payments", () => ({
  constructPayments: () => ({
    getPayment: jest.fn(),
    createPayment: jest.fn(),
    listPayments: listPaymentsMock,
  }),
}));

describe("listPayments", () => {
  it("should return a list of payments", async () => {
    listPaymentsMock.mockResolvedValueOnce([
      {
        id: "payment-id",
        amount: 100,
        currency: "USD",
      },
    ]);
    const result = await handler({} as unknown as APIGatewayProxyEvent);
    expect(result).toBeDefined();
    expect(listPaymentsMock).toHaveBeenCalledWith(undefined);
    const body = JSON.parse(result.body);
    expect(body.data).toEqual([
      { id: "payment-id", amount: 100, currency: "USD" },
    ]);
  });
  it("should filter the payments to the currency", async () => {
    listPaymentsMock.mockResolvedValueOnce([
      {
        id: "payment-id",
        amount: 100,
        currency: "USD",
      },
    ]);
    const result = await handler({
      queryStringParameters: { currency: "USD" },
    } as unknown as APIGatewayProxyEvent);
    expect(result).toBeDefined();
    expect(listPaymentsMock).toHaveBeenCalledWith("USD");
    const body = JSON.parse(result.body);
    expect(body.data).toEqual([
      { id: "payment-id", amount: 100, currency: "USD" },
    ]);
  });
});
