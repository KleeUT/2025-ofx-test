import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { constructPayments } from "../../src/lib/payments";
describe("payments", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  describe("list payments", () => {
    it("should query for payment by id", async () => {
      const sendFn = jest.fn();
      const mockClient = { send: sendFn } as unknown as DynamoDBDocumentClient;
      const payments = constructPayments(mockClient);
      sendFn.mockResolvedValueOnce({
        Item: {
          paymentId: 123,
          currency: "USD",
          amount: 1000,
        },
      });
      const result = await payments.getPayment("123");
      expect(result).toEqual({
        paymentId: 123,
        currency: "USD",
        amount: 1000,
      });
      expect(sendFn).toHaveBeenCalledWith(
        expect.objectContaining({
          input: {
            Key: { paymentId: "123" },
            TableName: "PaymentsTable",
          },
        }),
      );
    });

    it("should return null if no item is found", async () => {
      const sendFn = jest.fn();
      const mockClient = { send: sendFn } as unknown as DynamoDBDocumentClient;
      const payments = constructPayments(mockClient);
      sendFn.mockResolvedValueOnce({
        Item: undefined,
      });
      const result = await payments.getPayment("123");
      expect(result).toEqual(null);

      expect(sendFn).toHaveBeenCalledWith(
        expect.objectContaining({
          input: {
            Key: { paymentId: "123" },
            TableName: "PaymentsTable",
          },
        }),
      );
    });

    it("should filter to the provided currency", async () => {
      const sendFn = jest.fn();
      const mockClient = { send: sendFn } as unknown as DynamoDBDocumentClient;
      const payments = constructPayments(mockClient);
      sendFn.mockResolvedValueOnce({
        Items: [],
      });
      const result = await payments.listPayments("ABC");
      expect(result).toEqual([]);
      expect(sendFn).toHaveBeenCalledWith(
        expect.objectContaining({
          input: {
            ExpressionAttributeValues: { ":currency": "ABC" },
            FilterExpression: "currency = :currency",
            TableName: "PaymentsTable",
          },
        }),
      );
    });
    it("should not pass a filter expression if no currency is passed in", async () => {
      const sendFn = jest.fn();
      const mockClient = { send: sendFn } as unknown as DynamoDBDocumentClient;
      const payments = constructPayments(mockClient);
      sendFn.mockResolvedValueOnce({
        Items: [{ id: "payment-id", amount: 100, currency: "USD" }],
      });
      const result = await payments.listPayments();
      expect(result).toEqual([
        { id: "payment-id", amount: 100, currency: "USD" },
      ]);
      expect(sendFn).toHaveBeenCalledWith(
        expect.objectContaining({
          input: {
            TableName: "PaymentsTable",
          },
        }),
      );
    });
    it("listPayments should return empty array if no results returned", async () => {
      const sendFn = jest.fn();
      const mockClient = { send: sendFn } as unknown as DynamoDBDocumentClient;
      const payments = constructPayments(mockClient);
      sendFn.mockResolvedValueOnce({
        Items: undefined,
      });
      const result = await payments.listPayments("DEF");
      expect(result).toEqual([]);
      expect(sendFn).toHaveBeenCalledWith(
        expect.objectContaining({
          input: {
            ExpressionAttributeValues: { ":currency": "DEF" },
            FilterExpression: "currency = :currency",
            TableName: "PaymentsTable",
          },
        }),
      );
    });

    it("should create a payment", async () => {
      const sendFn = jest.fn();
      const mockClient = { send: sendFn } as unknown as DynamoDBDocumentClient;
      const payments = constructPayments(mockClient);
      sendFn.mockResolvedValueOnce({});
      await payments.createPayment({
        paymentId: "payment-id",
        amount: 100,
        currency: "USD",
      });
      expect(sendFn).toHaveBeenCalledWith(
        expect.objectContaining({
          input: {
            Item: { paymentId: "payment-id", amount: 100, currency: "USD" },
            TableName: "PaymentsTable",
          },
        }),
      );
    });
  });
});
