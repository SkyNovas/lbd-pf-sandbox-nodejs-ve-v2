import { v4 as uuid } from 'uuid';
import { ApiException } from '../exceptions/api.exception';

interface ResponseAPI {
  message: string;
  trackingUuid: string;
  data: any;
}
let body: any;
let headers: any = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Methods": "OPTIONS,GET,POST,PUT"
};
let responseAPI: ResponseAPI;
export function handleQuery(statusCode: number, msg: string, obj: object) {
  responseAPI = {
    message: msg,
    trackingUuid: uuid(),
    data: obj
  };
  body = JSON.stringify(responseAPI);
  return { statusCode, body, headers };
}

export function handleErrorQuery(statusCode: number, objRequest: ApiException) {
  body = JSON.stringify(objRequest);
  return { statusCode, body, headers };
}

export async function responsesAPI(statusCode: number, objRequest: object) {
  switch (statusCode) {
    case 200:
      return handleQuery(
        statusCode,
        "Successful operation.",
        objRequest
      );
    case 201:
      return handleQuery(
        statusCode,
        "Successful operation.",
        objRequest
      );
    default:
      return handleQuery(
        200,
        "Successful operation.",
        objRequest
      );
  }
}

export async function responsesAPIError(objRequest: ApiException) {
  switch (objRequest.message) {
    case "Bad Request":
      return handleErrorQuery(
        400,
        objRequest
      );
    case "Unauthorized":
      return handleErrorQuery(
        401,
        objRequest
      );
    case "Not Found":
      return handleErrorQuery(
        404,
        objRequest
      );
    case "Internal Server Error":
      return handleErrorQuery(
        500,
        objRequest
      );
    default:
      return handleErrorQuery(
        500,
        objRequest
      );
  }
}
