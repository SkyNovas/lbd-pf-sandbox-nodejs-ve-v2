import { ApiException, ApiExceptionDetails } from '../../src/exceptions/api.exception';

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid')
}));

describe('ApiException', () => {
  const originalEnv = process.env;
  beforeAll(() => {
    process.env.NAME_API = 'API_NAME';
  });
  afterAll(() => {
    process.env = originalEnv;
  });

  it('equals meessage code correct', () => {
    const code = 400;
    const details = ['Detalle del error'];
    const exception = new ApiException(code, details);

    expect(exception.name).toBe('ApiException');
    expect(exception.message).toBe('Bad Request');
    expect(exception.code).toBe(`${code}.LBD-PF-SANDBOX-NODEJS-VE.100${code}`);
    expect(exception.uuid).toBe('test-uuid');
    expect(exception.details).toEqual(details);
  });

  it('equals meessage correct', () => {
    const exception400 = new ApiException(400, []);
    expect(exception400.message).toBe('Bad Request');

    const exception401 = new ApiException(401, []);
    expect(exception401.message).toBe('Unauthorized');

    const exception404 = new ApiException(404, []);
    expect(exception404.message).toBe('Not Found');

    const exception500 = new ApiException(500, []);
    expect(exception500.message).toBe('Internal Server Error');

    const exceptionDefault = new ApiException(999, []);
    expect(exceptionDefault.message).toBe('Internal Server Error');
  });

  it('to JSON format', () => {
    const code = 404;
    const details = ['No encontrado'];
    const exception = new ApiException(code, details);

    const expectedJson: ApiExceptionDetails = {
      code: `${code}.LBD-PF-SANDBOX-NODEJS-VE.100${code}`,
      message: 'Not Found',
      trackingUuid: 'test-uuid',
      details: details,
    };

    expect(exception.toJSON()).toEqual(expectedJson);
  });

  it('item code correct', () => {
    const code = 500;
    const exception = new ApiException(code, []);

    expect(exception.code).toBe(`${code}.LBD-PF-SANDBOX-NODEJS-VE.100${code}`);
  });
});
