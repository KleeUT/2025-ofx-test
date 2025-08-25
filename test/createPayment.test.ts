import * as payments from "../src/lib/payments";
import { handler } from "../src/createPayment";
import { apiGatewayEventWithBody } from "./apiGatewayEventUtils";
import { availableCurrencies } from "../src/currencies";

const createPaymentMock = jest.fn();
jest.mock("../src/lib/payments", () => ({
  constructPayments: () => ({
    getPayment: jest.fn(),
    listPayments: jest.fn(),
    createPayment: createPaymentMock,
  }),
}));

describe("createPayment", () => {
  it("should create a payment successfully", async () => {
    createPaymentMock.mockResolvedValueOnce({});

    jest
      .spyOn(crypto, "randomUUID")
      .mockReturnValue("0000-0000-0000-0000-0000");

    const response = await handler(
      apiGatewayEventWithBody({
        amount: 100,
        currency: "USD",
      }),
    );
    expect(createPaymentMock).toHaveBeenCalledWith({
      paymentId: "0000-0000-0000-0000-0000",
      amount: 100,
      currency: "USD",
    });
    expect(response.statusCode).toBe(201);
    expect(JSON.parse(response.body)).toEqual({
      result: "0000-0000-0000-0000-0000",
    });
  });
  describe("validation", () => {
    beforeEach(() => {
      createPaymentMock.mockResolvedValueOnce({});

      jest
        .spyOn(crypto, "randomUUID")
        .mockReturnValue("0000-0000-0000-0000-0000");
    });
    test.each(availableCurrencies)(
      "%s is a valid currency",
      async (currency) => {
        const response = await handler(
          apiGatewayEventWithBody({
            amount: 100,
            currency,
          }),
        );
        expect(response.statusCode).toBe(201);
      },
    );
  });
  it("should reject ABC as invalid currency", async () => {
    const response = await handler(
      apiGatewayEventWithBody({
        amount: 100,
        currency: "ABC",
      }),
    );
    expect(response.statusCode).toBe(422);
    expect(JSON.parse(response.body)).toEqual({
      errors: [
        {
          path: "currency",
          error: "Currency ABC is not supported",
        },
      ],
    });
  });
  test.each([0, -100])("should reject %i as invalid amount", async (amount) => {
    const response = await handler(
      apiGatewayEventWithBody({
        amount,
        currency: "USD",
      }),
    );
    expect(response.statusCode).toBe(422);
    expect(JSON.parse(response.body)).toEqual({
      errors: [
        {
          path: "amount",
          error: "Amount must be greater than 0",
        },
      ],
    });
  });
  it("should include both currency and amount errors", async () => {
    const response = await handler(
      apiGatewayEventWithBody({
        amount: 0,
        currency: "ABC",
      }),
    );
    expect(response.statusCode).toBe(422);
    expect(JSON.parse(response.body)).toEqual({
      errors: [
        {
          path: "amount",
          error: "Amount must be greater than 0",
        },
        {
          path: "currency",
          error: "Currency ABC is not supported",
        },
      ],
    });
  });
  it("should not allow extra fields in body", async () => {
    const response = await handler(
      apiGatewayEventWithBody({
        amount: 100,
        currency: "USD",
        extraField: "extraValue",
      }),
    );
    expect(response.statusCode).toBe(422);
    expect(JSON.parse(response.body)).toEqual({
      errors: [
        {
          path: "extraField",
          error: "extraField is not allowed",
        },
      ],
    });
  });
});
