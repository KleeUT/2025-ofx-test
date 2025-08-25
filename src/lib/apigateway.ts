import { APIGatewayProxyResult } from "aws-lambda";

export const buildResponse = (
  statusCode: number,
  body: object,
): APIGatewayProxyResult => {
  return {
    statusCode,
    body: JSON.stringify(body),
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
  };
};

export const parseInput = (body: string): object => {
  try {
    return JSON.parse(body);
  } catch (err) {
    console.error(err);
    return {};
  }
};
