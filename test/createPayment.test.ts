import * as payments from "../src/lib/payments";
import { randomUUID } from "crypto";
import { handler } from "../src/createPayment";
import { apiGatewayEventWithBody } from "./apiGatewayEventUtils";
describe("createPayment", () => {
  it("should create a payment successfully", async () => {
    const paymentMock = jest
      .spyOn(payments, "createPayment")
      .mockResolvedValueOnce();

    jest
      .spyOn(crypto, "randomUUID")
      .mockReturnValue("0000-0000-0000-0000-0000");

    const response = await handler(
      apiGatewayEventWithBody({
        amount: 100,
        currency: "USD",
      }),
    );
    expect(paymentMock).toHaveBeenCalledWith({
      id: "0000-0000-0000-0000-0000",
      amount: 100,
      currency: "USD",
    });
    expect(response.statusCode).toBe(201);
    expect(JSON.parse(response.body)).toEqual({
      result: "0000-0000-0000-0000-0000",
    });
  });
});
