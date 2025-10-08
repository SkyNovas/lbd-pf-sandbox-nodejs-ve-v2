import { GetSchemaVersionCommand, GlueClient } from '@aws-sdk/client-glue';
import { mockClient } from 'aws-sdk-client-mock';
import { GlueSchemaService } from '../../src/utils/schema.glue';

describe('GlueSchemaService', () => {
    const glueMock = mockClient(GlueClient);
    let service: GlueSchemaService;

    beforeEach(() => {
        glueMock.reset();
        service = new GlueSchemaService();
    });

    it('debe obtener la definición del esquema correctamente', async () => {
        const schemaDefinition = '{"type": "record", "name": "test"}';
        
        glueMock.on(GetSchemaVersionCommand).resolves({
            SchemaDefinition: schemaDefinition
        });

        const result = await service.getSchemaDefinition('test-schema');
        expect(result).toBe(schemaDefinition);
    });

    it('debe usar la definición en caché en llamadas subsecuentes', async () => {
        const schemaDefinition = '{"type": "record", "name": "test"}';
        
        glueMock.on(GetSchemaVersionCommand).resolves({
            SchemaDefinition: schemaDefinition
        });

        // Primera llamada
        await service.getSchemaDefinition('test-schema');
        
        // Segunda llamada
        await service.getSchemaDefinition('test-schema');

        // Verifica que el mock solo fue llamado una vez
        expect(glueMock.calls()).toHaveLength(1);
    });

    it('debe manejar el caso cuando no hay definición de esquema', async () => {
        glueMock.on(GetSchemaVersionCommand).resolves({
            SchemaDefinition: undefined
        });

        const result = await service.getSchemaDefinition('test-schema');
        expect(result).toBeUndefined();
    });
});