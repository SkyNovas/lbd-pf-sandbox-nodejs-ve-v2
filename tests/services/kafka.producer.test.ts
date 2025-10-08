import { sendTopicProducer } from '../../src/services/kafka.producer';
import { kafka } from '../../src/config/kafka/kafka.config';
import { ApiException } from '../../src/exceptions/api.exception';
import { allSManager } from '../../src/config/secrets/secret.manager';
import avro from 'avsc';
import { GlueSchemaService } from '../../src/utils/schema.glue';
import { Producer } from 'kafkajs';

jest.mock('../../src/config/kafka/kafka.config', () => ({
    kafka: jest.fn().mockImplementation(() => ({
        producer: jest.fn().mockReturnValue({
            connect: jest.fn().mockResolvedValue(undefined),
            disconnect: jest.fn().mockResolvedValue(undefined),
            send: jest.fn().mockResolvedValue(undefined),
        }),
    })),
}));

jest.mock('../../src/utils/schema.glue', () => ({
    GlueSchemaService: jest.fn().mockImplementation(() => ({
        getSchemaDefinition: jest.fn().mockResolvedValue({
            type: 'record',
            name: 'test',
            fields: []
        })
    }))
}));

jest.mock('../../src/config/secrets/secret.manager', () => ({
    GetCertificate: jest.fn().mockImplementation(() => ({
        getCerts: jest.fn().mockResolvedValue({
            capem: 'mockCa',
            keypem: 'mockKey',
            certpem: 'mockCert',
            phrase: 'mockPhrase'
        })
    }))
}));


jest.mock('avsc', () => ({
    parse: jest.fn().mockReturnValue({
        toBuffer: jest.fn().mockReturnValue(Buffer.from('buffer')),
    }),
}));

describe('sendTopicProducer', () => {
    let producer: any;
    const originalEnv = process.env;

    const mockCerts = {
        capem: 'mockCa',
        keypem: 'mockKey',
        certpem: 'mockCert',
        phrase: 'mockPhrase'
    };

    jest.mock('../../src/config/secrets/secret.manager', () => ({
        GetCertificate: jest.fn(() => ({
            getCerts: jest.fn().mockResolvedValue({
                capem: 'mockCa',
                keypem: 'mockKey',
                certpem: 'mockCert',
                phrase: 'mockPhrase'
            })
        }))
    }));
    beforeEach(async () => {
        process.env.GLUE_SCHEMA_NAME = 'undefined';
        jest.clearAllMocks();
        (GlueSchemaService as jest.MockedClass<typeof GlueSchemaService>).prototype.getSchemaDefinition = 
            jest.fn().mockResolvedValue({
                type: 'record',
                name: 'test',
                fields: []
            });
        producer = {
            connect: jest.fn().mockResolvedValue(undefined),
            disconnect: jest.fn().mockResolvedValue(undefined),
            send: jest.fn().mockResolvedValue(undefined),
        };
        (kafka as jest.Mock).mockImplementation(() => ({
            producer: () => producer
        }));
    });

    afterEach(() => {
        jest.clearAllMocks();
        process.env = originalEnv;
    });

    it('send a message successfully', async () => {
        const messages = '{"key": "value"}';
        const schema = {
            "type": "object",
            "properties": {
                "key": {
                    "type": "string"
                }
            },
            "required": ["key"]
        };

        await sendTopicProducer(messages);
        expect(producer.send).toHaveBeenCalledWith({
            topic: `${process.env['GLUE_SCHEMA_NAME']}`,
            messages: [{ value: Buffer.from('buffer') }],
        });
        expect(producer.disconnect).toHaveBeenCalledTimes(1);
    });

    it('should throw ApiException when there is an error in the producer', async () => {
        const messages = '{"key": "value"}';
        const schema = {
            "type": "object",
            "properties": {
                "key": { "type": "string" }
            }
        };

        producer.send.mockImplementation(() => {
            throw new Error('Kafka error');
        });

        try {
            await sendTopicProducer(messages);
            fail('Se esperaba que lanzara una excepción');
        } catch (error) {
            const apiError = error as ApiException;
            expect(apiError).toBeInstanceOf(ApiException);
            expect(apiError.code).toMatch('500.LBD-PF-SANDBOX-NODEJS-VE.100500');
            expect(apiError.message).toBe('Internal Server Error');
        }

        expect(producer.disconnect).toHaveBeenCalledTimes(1);
    });

    it('should throw ApiException when producer.send fails', async () => {
        const messages = '{"key": "value"}';
       
        producer.send.mockRejectedValue(new Error('Error producer the topic'));

        await expect(sendTopicProducer(messages))
            .rejects
            .toThrow(ApiException);

        expect(producer.disconnect).toHaveBeenCalledTimes(1);
    });



    it('should throw ApiException when there is an error in the producer', async () => {
        const messages = '{"key": "value"}';
       
        producer.send.mockImplementation(() => {
            throw new Error('Error producer the topic: pf-mw-registry');
        });

        try {
            await sendTopicProducer(messages);
            fail('Se esperaba que lanzara una excepción');
        } catch (error) {
            const apiError = error as ApiException;
            expect(apiError).toBeInstanceOf(ApiException);
            expect(apiError.code).toBe('500.LBD-PF-SANDBOX-NODEJS-VE.100500');
            expect(apiError.message).toBe('Internal Server Error');
        }
        expect(producer.disconnect).toHaveBeenCalledTimes(1);
    });

});