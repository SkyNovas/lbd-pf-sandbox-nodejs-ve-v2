import { Kafka } from 'kafkajs';

describe('Configuración de Kafka', () => {
  const mockEnv = {
    'VAR_PF_TRANSVERSAL_DS_BOOTSTRAPSERVERS': 'broker1:9092,broker2:9092',
    'AWS_LAMBDA_LBD-PF-SANDBOX-NODEJS-VE': 'test-client',
    'SSL_KEY_PASSWORD': 'test-password'
  };

  const mockCerts = {
    capem: 'ca-content',
    keypem: 'key-content',
    certpem: 'cert-content',
    phrase: 'test-password'
  };

  const mockkafkajs = jest.fn();
  jest.mock('kafkajs', () => ({
    Kafka: mockkafkajs
  }));

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    process.env = { ...mockEnv };
  });

  // ... existing code ...

  test('debería crear una instancia de Kafka con la configuración correcta', async () => {
    const { kafka } = await import('../../../src/config/kafka/kafka.config');
    await kafka(mockCerts);
    
    expect(mockkafkajs).toHaveBeenCalledWith({
      clientId: 'LBD-PF-SANDBOX-NODEJS-VE',
      brokers: ['broker1:9092', 'broker2:9092'],
      ssl: {
        rejectUnauthorized: false,
        ca: ['-----BEGIN CERTIFICATE-----\nca-content\n-----END CERTIFICATE-----'],
        key: '-----BEGIN PRIVATE KEY-----\nkey-content\n-----END PRIVATE KEY-----',
        cert: '-----BEGIN CERTIFICATE-----\ncert-content\n-----END CERTIFICATE-----',
        passphrase: 'test-password'
      }
    });
  });

  test('debería manejar una instancia de Kafka con certificados', async () => {
    const { kafka } = await import('../../../src/config/kafka/kafka.config');
    const kafkaInstance = await kafka(mockCerts);
    expect(kafkaInstance).toBeDefined();
  });
});