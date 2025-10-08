import { handleQuery, handleErrorQuery, responsesAPI, responsesAPIError } from '../../src/utils/api.response';
import { ApiException } from '../../src/exceptions/api.exception';

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mocked-uuid'), // Mockea el uuid para tener un valor fijo
}));

describe('handleQuery', () => {
  it('should return a response with the given status code, message, and data', () => {
    const statusCode = 200;
    const message = 'Success';
    const data = { key: 'value' };

    const result = handleQuery(statusCode, message, data);

    expect(result.statusCode).toBe(statusCode);
    expect(result.headers['Content-Type']).toBe('application/json');
    expect(JSON.parse(result.body)).toEqual({
      message,
      trackingUuid: 'mocked-uuid',
      data,
    });
  });
});

describe('handleErrorQuery', () => {
  it('should return an error response with the given status code and request object', () => {
    const statusCode = 400;
    const error = new ApiException(400, ['Invalid request']);

    const result = handleErrorQuery(statusCode, error);

    expect(result.statusCode).toBe(statusCode);
    expect(result.headers['Content-Type']).toBe('application/json');
  
  });
});

describe('responsesAPI', () => {
  it('should return a 200 response for a successful operation', async () => {
    const statusCode = 200;
    const data = { key: 'value' };

    const result = await responsesAPI(statusCode, data);

    expect(result.statusCode).toBe(statusCode);
    expect(JSON.parse(result.body)).toEqual({
      message: 'Successful operation.',
      trackingUuid: 'mocked-uuid',
      data,
    });
  });

  it('should return a 201 response for a successful operation', async () => {
    const statusCode = 201;
    const data = { key: 'value' };

    const result = await responsesAPI(statusCode, data);

    expect(result.statusCode).toBe(statusCode);
    expect(JSON.parse(result.body)).toEqual({
      message: 'Successful operation.',
      trackingUuid: 'mocked-uuid',
      data,
    });
  });

  it('should default to a 200 response for unrecognized status codes', async () => {
    const statusCode = 500;
    const data = { key: 'value' };

    const result = await responsesAPI(statusCode, data);

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual({
      message: 'Successful operation.',
      trackingUuid: 'mocked-uuid',
      data,
    });
  });
});



///
describe('responsesAPI 201', () => {
  it('should return a 201 response for a successful operation', async () => {
    const statusCode = 201;
    const data = { key: 'value' };

    const result = await responsesAPI(statusCode, data);

    expect(result.statusCode).toBe(statusCode);
    expect(JSON.parse(result.body)).toEqual({
      message: 'Successful operation.',
      trackingUuid: 'mocked-uuid',
      data,
    });
  });
});
///

describe('responsesAPIError', () => {
  it('should return a 400 response for "Bad Request" error', async () => {
    const error = new ApiException(400, ['Bad Request']);
    error.code = 'Bad Request';

    const result = await responsesAPIError(error);

    expect(result.statusCode).toBe(400);
   
  });

  it('should return a 401 response for "Unauthorized" error', async () => {
    const error = new ApiException(401, ['Unauthorized']);
    error.code = 'Unauthorized';

    const result = await responsesAPIError(error);

    expect(result.statusCode).toBe(401);
   
  });

  it('should return a 404 response for "Not Found" error', async () => {
    const error = new ApiException(404, ['Not Found']);
    error.code = 'Not Found';

    const result = await responsesAPIError(error);

    expect(result.statusCode).toBe(404);
    
  });

  it('should return a 500 response for "Internal Server Error" error', async () => {
    const error = new ApiException(500, ['Internal Server Error']);
    error.code = 'Internal Server Error';

    const result = await responsesAPIError(error);

    expect(result.statusCode).toBe(500);

  });

  it('should default to a 500 response for unrecognized error codes', async () => {
    const error = new ApiException(999, ['Unknown Error']);
    error.code = 'Unknown';

    const result = await responsesAPIError(error);

    expect(result.statusCode).toBe(500);

  });
});
