import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

const client = new SecretsManagerClient({ region: process.env.AWS_REGION });


export interface allSManager {
    capem: string;
    keypem: string;
    certpem: string;
    phrase: string;
}

export class GetCertificate {
    private allCertificates: allSManager | undefined;
    public async getCerts(): Promise<allSManager | undefined> {
        if (this.allCertificates) {
            return this.allCertificates;
        } else {
            const command = new GetSecretValueCommand({
                SecretId: "sm-sandbox-kafka-certs"
            });
            const data = await client.send(command);
            if (data.SecretString) {
                this.allCertificates = this.getCleanCert(JSON.parse(data.SecretString));
            }
            return this.allCertificates;
        }
    }

    private getCleanCert(pManager: Record<string, any>): allSManager {
        const keys = Object.keys(pManager);
        const allData: allSManager = {
            capem: '',
            keypem: '',
            certpem: '',
            phrase: ''
        };
        const keyMap: Record<string, keyof allSManager> = {
            '_DS_CA': 'capem',
            '_DS_CERTIFICATE': 'certpem',
            '_DS_KEY': 'keypem',
            '_DS_KEYPEMPASSWORD': 'phrase'
        };
        for (const key in pManager) {
            if (pManager.hasOwnProperty(key)) {
                for (const suffix in keyMap) {
                    if (key.endsWith(suffix)) {
                        allData[keyMap[suffix]] = pManager[key].replace(/\n/g, '')
                                                .replace(/-----BEGIN CERTIFICATE-----|-----END CERTIFICATE-----/g, '')
                                                .replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----/g, '')
                                                .trim();
                    }
                }
            }
        }
        return allData;
    }
}