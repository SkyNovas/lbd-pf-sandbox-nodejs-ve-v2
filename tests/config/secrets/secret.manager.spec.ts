import { mockClient } from 'aws-sdk-client-mock';
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';
import { GetCertificate } from '../../../src/config/secrets/secret.manager';

const smMock = mockClient(SecretsManagerClient);

describe('GetCertificate', () => {
    beforeEach(() => {
        smMock.reset();
    });

    it('debería obtener y limpiar los certificados correctamente', async () => {
        // Mock de los datos del certificado
        const mockSecretData = {
            'test_DS_CA': '-----BEGIN CERTIFICATE-----\nCAdata123\n-----END CERTIFICATE-----',
            'test_DS_CERTIFICATE': '-----BEGIN CERTIFICATE-----\nCERTdata456\n-----END CERTIFICATE-----',
            'test_DS_KEY': '-----BEGIN PRIVATE KEY-----\nKEYdata789\n-----END PRIVATE KEY-----',
            'test_DS_KEYPEMPASSWORD': 'secretphrase'
        };

        // Configurar el mock
        smMock.on(GetSecretValueCommand).resolves({
            SecretString: JSON.stringify(mockSecretData)
        });

        const getCertificate = new GetCertificate();
        const result = await getCertificate.getCerts();

        // Verificar el resultado
        expect(result).toEqual({
            capem: 'CAdata123',
            keypem: 'KEYdata789',
            certpem: 'CERTdata456',
            phrase: 'secretphrase'
        });
    });

    it('debería devolver el cache si ya existe', async () => {
        // Mock de los datos del certificado
        const mockSecretData = {
            'test_DS_CA': '-----BEGIN CERTIFICATE-----\nCAdata123\n-----END CERTIFICATE-----',
            'test_DS_CERTIFICATE': '-----BEGIN CERTIFICATE-----\nCERTdata456\n-----END CERTIFICATE-----',
            'test_DS_KEY': '-----BEGIN PRIVATE KEY-----\nKEYdata789\n-----END PRIVATE KEY-----',
            'test_DS_KEYPEMPASSWORD': 'secretphrase'
        };

        // Configurar el mock
        smMock.on(GetSecretValueCommand).resolves({
            SecretString: JSON.stringify(mockSecretData)
        });

        const getCertificate = new GetCertificate();
        
        // Primera llamada
        await getCertificate.getCerts();
        
        // Segunda llamada - debería usar el cache
        const result = await getCertificate.getCerts();

        // Verificar que el mock solo fue llamado una vez
        expect(smMock.calls()).toHaveLength(1);
        
        // Verificar el resultado
        expect(result).toEqual({
            capem: 'CAdata123',
            keypem: 'KEYdata789',
            certpem: 'CERTdata456',
            phrase: 'secretphrase'
        });
    });

    it('debería manejar el caso cuando no hay SecretString', async () => {
        // Configurar el mock para devolver undefined
        smMock.on(GetSecretValueCommand).resolves({
            SecretString: undefined
        });

        const getCertificate = new GetCertificate();
        const result = await getCertificate.getCerts();

        expect(result).toBeUndefined();
    });
}); 