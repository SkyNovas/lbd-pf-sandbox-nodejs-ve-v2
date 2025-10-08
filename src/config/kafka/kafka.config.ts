import { allSManager } from '../secrets/secret.manager';
import { Kafka } from 'kafkajs';
const brokers = `${process.env['VAR_PF_TRANSVERSAL_DS_BOOTSTRAPSERVERS']}`.split(",")

export const kafka = async (certs: allSManager | undefined ): Promise<Kafka> => {
  return new Kafka({
    clientId: `LBD-PF-SANDBOX-NODEJS-VE`,
    brokers: brokers,
    ssl: {
      rejectUnauthorized: false,
      ca: [`-----BEGIN CERTIFICATE-----\n${certs?.capem}\n-----END CERTIFICATE-----`],
      key: `-----BEGIN PRIVATE KEY-----\n${certs?.keypem}\n-----END PRIVATE KEY-----`,
      cert: `-----BEGIN CERTIFICATE-----\n${certs?.certpem}\n-----END CERTIFICATE-----`,
      passphrase: `${certs?.phrase}`,
    },
  });
}