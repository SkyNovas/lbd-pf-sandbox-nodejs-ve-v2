import { Producer, Partitioners } from 'kafkajs';

import { ApiException } from '../exceptions/api.exception';
import { kafka } from '../config/kafka/kafka.config';
import { GlueSchemaService } from '../utils/schema.glue';
import { allSManager, GetCertificate } from '../config/secrets/secret.manager';

var avro = require('avsc');

var producer: Producer;
const topic = "undefined";
const glue = new GlueSchemaService();
const get = new GetCertificate();

const createProducer = async (certs: allSManager | undefined ) => {
    return producer = (await kafka(certs)).producer({ createPartitioner: Partitioners.DefaultPartitioner })
}

const start = async () => {
    return await producer.connect();
}

const shutdown = async () => {
    return await producer.disconnect();
}

const sendMessage = async (messages: string) => {
    return producer
    .send({
      topic,
      messages: [{ value: messages }],
    });
}

export const sendTopicProducer = async (messages: string): Promise<void> => {
    try {
        const certs = await get.getCerts();
        const schema = await glue.getSchemaDefinition(topic);

        if (!schema) {
            throw new ApiException(500, ['The schema does not have a valid definition.']);
        }
        
        await createProducer(certs);
        await start();
 
        const avroType = avro.parse(schema);
        const encodedMessage = avroType.toBuffer(JSON.parse(messages));
        console.log(`Sending messages to kafka for the topic: ${encodedMessage}`);
        await sendMessage(encodedMessage);
        
        console.log(`Successfully sent to kafka for the topic: "${topic}"`);
        
    } catch (error: unknown) {
        console.error(`Details when sending message to kafka: ${error instanceof Error ? error.message : 'Error sending message to kafka'}`);
        throw new ApiException(500, [`Error producer the topic: ${topic}`]);
    } finally {
        await shutdown();
    }
}

export default sendTopicProducer;