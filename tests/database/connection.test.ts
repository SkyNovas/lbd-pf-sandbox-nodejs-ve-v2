import { getExampleCollection } from '../../src/database/mongo/connection';
import { connectToDatabase } from '../../src/config/database/mongo.config';
import { ApiException } from '../../src/exceptions/api.exception';

// Mock del módulo de configuración de la base de datos
jest.mock('../../src/config/database/mongo.config');

describe('Connection Tests', () => {
    beforeEach(() => {
        process.env.NAME_API = 'undefined';
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('debería manejar una conexión exitosa', async () => {
        // Preparar
        const mockDisconnect = jest.fn();
        (connectToDatabase as jest.Mock).mockResolvedValue({
            disconnect: mockDisconnect
        });

        // Ejecutar
        await getExampleCollection();

        // Verificar
        expect(connectToDatabase).toHaveBeenCalled();
        expect(mockDisconnect).toHaveBeenCalled();
    });

    test('debería lanzar ApiException cuando falla la conexión', async () => {
        // Preparar
        (connectToDatabase as jest.Mock).mockRejectedValue(new Error('Error de conexión'));

        try {
            // Ejecutar
            await getExampleCollection();
            fail('Se esperaba que la función lanzara una excepción');
        } catch (error: any) {
            // Verificar
            expect(error).toBeInstanceOf(ApiException);
            expect(error.message).toBe('Internal Server Error');
            expect(error.code).toBe('500.LBD-PF-SANDBOX-NODEJS-VE.100500');
            expect(error.details).toEqual(["Error retrieving the collection {collection_name}."]);
            expect(error.uuid).toBeDefined();
            expect(typeof error.uuid).toBe('string');
        }
    });
});