import * as payments from "../src/lib/payments";
import { randomUUID } from "crypto";
import { handler } from "../src/getPayment";
import { APIGatewayProxyEvent } from "aws-lambda";

const getPaymentMock = jest.fn();
jest.mock("../src/lib/payments", () => ({
  constructPayments: () => ({
    getPayment: getPaymentMock,
    listPayments: jest.fn(),
    createPayment: jest.fn(),
  }),
}));

describe("When the user requests the records for a specific payment", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("Returns the payment matching their input parameter.", async () => {
    const paymentId = randomUUID();
    const mockPayment = {
      id: paymentId,
      currency: "AUD",
      amount: 2000,
    };

    getPaymentMock.mockResolvedValueOnce(mockPayment);

    const result = await handler({
      pathParameters: {
        id: paymentId,
      },
    } as unknown as APIGatewayProxyEvent);

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual(mockPayment);

    expect(getPaymentMock).toHaveBeenCalledWith(paymentId);
  });
  it("Rejects when there is no paymentId passed in", async () => {
    getPaymentMock.mockRejectedValueOnce(new Error("Payment not found"));

    const result = await handler({
      pathParameters: {},
    } as unknown as APIGatewayProxyEvent);

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body)).toEqual({ error: "Missing payment ID" });

    expect(getPaymentMock).not.toHaveBeenCalled();
  });
  it("Returns 404 if the payment is not found", async () => {
    const paymentId = randomUUID();
    const mockPayment = {
      id: paymentId,
      currency: "AUD",
      amount: 2000,
    };
    getPaymentMock.mockResolvedValueOnce(null);

    const result = await handler({
      pathParameters: {
        id: paymentId,
      },
    } as unknown as APIGatewayProxyEvent);

    expect(result.statusCode).toBe(404);
    expect(JSON.parse(result.body)).toEqual({ error: "Payment not found" });

    expect(getPaymentMock).toHaveBeenCalledWith(paymentId);
  });
});

afterEach(() => {
  jest.resetAllMocks();
});
