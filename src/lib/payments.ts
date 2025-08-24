import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";

export function constructPayments(client: DynamoDBDocumentClient) {
  const getPayment = async (paymentId: string): Promise<Payment | null> => {
    const result = await client.send(
      new GetCommand({
        TableName: "Payments",
        Key: { paymentId },
      }),
    );

    return (result.Item as Payment) || null;
  };

  const listPayments = async (
    currency: string | undefined = undefined,
  ): Promise<Payment[]> => {
    const command = currency
      ? new ScanCommand({
          TableName: "Payments",
          FilterExpression: "currency = :currency",
          ExpressionAttributeValues: {
            ":currency": currency,
          },
        })
      : new ScanCommand({
          TableName: "Payments",
        });
    const result = await client.send(command);

    return (result.Items as Payment[]) || [];
  };

  const createPayment = async (payment: Payment) => {
    await client.send(
      new PutCommand({
        TableName: "Payments",
        Item: payment,
      }),
    );
  };
  return {
    getPayment,
    listPayments,
    createPayment,
  };
}

export type Payment = {
  id: string;
  amount: number;
  currency: string;
};
