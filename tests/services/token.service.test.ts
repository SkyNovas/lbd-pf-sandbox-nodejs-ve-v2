import axios from 'axios';
import { getToken, getKeys } from '../../src/services/token.service';
import MockAdapter from 'axios-mock-adapter';

describe('API Requests', () => {
    let mockAxios: MockAdapter;
    const originalEnv = process.env;

    beforeAll(() => {
        process.env.URI_TOKEN = 'https://mock-uri-token.com';
        process.env.URI_KEY = 'https://mock-uri-key.com';
        process.env.CUSTOMER_KEY = 'mock-customer-key';
        process.env.CUSTOMER_SECRET = 'mock-customer-secret';

        mockAxios = new MockAdapter(axios);
    });

    afterAll(() => {
        process.env = originalEnv;
    });

    afterEach(() => {
        mockAxios.reset();
    });

    describe('getToken', () => {
        it('should return a valid token on success', async () => {
            mockAxios.onPost(process.env.URI_TOKEN).reply(200, { access_token: 'mock-access-token' });
            const response = await getToken();
            expect(response.access_token).toBe('mock-access-token');
        });

        it('should throw an error when the request fails', async () => {
            mockAxios.onGet(process.env.URI_KEY).reply(500);
            await expect(getToken()).rejects.toThrow('Internal Server Error');
        });

        it('should return a valid keys on success', async () => {
            mockAxios.onGet(process.env.URI_KEY).reply(200, { message: 'Successful operation' });
            const response = await getKeys('mock-access-token');
            expect(response.message).toBe('Successful operation');
        });

        it('should throw an error when the request fails', async () => {
            mockAxios.onGet(process.env.URI_KEY).reply(500);
            await expect(getKeys('mock-access-token')).rejects.toThrow('Internal Server Error');
        });
    });

});
