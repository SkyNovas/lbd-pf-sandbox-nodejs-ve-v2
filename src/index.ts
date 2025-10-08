import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { responsesAPI, responsesAPIError } from './utils/api.response';
import { ApiException } from './exceptions/api.exception';

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  try {
    const requestBody = event.body ? JSON.parse(event.body) : null;
    const requestHeaders = event.headers ? event.headers : null;
    return await responsesAPI(200, { "result": "Ok" });
  } catch (error) {
    if (error instanceof ApiException) {
      return await responsesAPIError(error)
    }
    console.log(error)
    return await responsesAPIError(new ApiException(500, ["Internal Server Error"]))
  }
};




