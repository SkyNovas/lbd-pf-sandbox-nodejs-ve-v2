import { handler } from './src/index';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';

const event: APIGatewayProxyEvent = {
  body: JSON.stringify({ message: 'Example messsage' }),
  headers: { 'Content-Type': 'application/json' },
  httpMethod: 'POST',
  isBase64Encoded: false,
  path: '/test',
  pathParameters: null,
  queryStringParameters: null,
  stageVariables: null,
  requestContext: {} as any,
  resource: '/test',
  multiValueHeaders: {},
  multiValueQueryStringParameters: null,
};

const context: Context = {} as any;

(async () => {
  try {
    const response = await handler(event, context);
    console.log('Response:', response);
  } catch (error) {
    console.error('Error:', error);
  }
})();
