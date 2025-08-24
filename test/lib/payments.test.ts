import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { constructPayments } from "../../src/lib/payments";
describe("payments", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  describe("list payments", () => {
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
            TableName: "Payments",
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
            TableName: "Payments",
          },
        }),
      );
    });
  });
});
