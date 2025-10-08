import { responsesAPI, responsesAPIError } from '../src/utils/api.response';
import { ApiException } from '../src/exceptions/api.exception';
import { handler } from '../src/index';


jest.mock('../src/utils/api.response', () => ({
    responsesAPI: jest.fn(),
    responsesAPIError: jest.fn()
}));

describe('handler', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 200 for successful response', async () => {
        const mockEvent = {
            body: JSON.stringify({ data: 'test' }),
            headers: { 'content-type': 'application/json' }
        };
        (responsesAPI as jest.Mock).mockReturnValue({
            statusCode: 200,
            body: JSON.stringify({ "result": "Ok" }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const result = await handler(mockEvent as any, {} as any);
        expect(responsesAPI).toHaveBeenCalledWith(200, { "result": "Ok" });
        expect(result).toEqual({
            statusCode: 200,
            body: JSON.stringify({ "result": "Ok" }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    });

    test('debería manejar ApiException', async () => {
        const mockEvent = {
            body: null,
            headers: null
        };

        (responsesAPI as jest.Mock).mockImplementation(() => {
            throw new ApiException(400, ['Error de prueba']);
        });

        (responsesAPIError as jest.Mock).mockResolvedValue({
            statusCode: 400,
            body: JSON.stringify({ errors: ['Error de prueba'] }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const result = await handler(mockEvent as any, {} as any);

        expect(responsesAPIError).toHaveBeenCalledWith(expect.any(ApiException));

        expect(result).toEqual({
            statusCode: 400,
            body: JSON.stringify({ errors: ['Error de prueba'] }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

    });

});
