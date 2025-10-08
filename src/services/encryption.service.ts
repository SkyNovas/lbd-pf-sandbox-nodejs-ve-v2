import * as crypto from 'crypto';


let privateKey: crypto.KeyObject;
let publicKey: crypto.KeyObject;

export class AlgorithEncryp {

    constructor(publicKeyString: string) {
        publicKey = crypto.createPublicKey({
            key: `-----BEGIN PUBLIC KEY-----\n${publicKeyString}\n-----END PUBLIC KEY-----`,
            format: 'pem',
            type: 'spki',
        });
    }

    data(data: string): string {
        const bufferData = Buffer.from(data, 'utf8');
        const encryptedBuffer = crypto.publicEncrypt(
            {
                key: publicKey,
                padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                oaepHash: 'sha256',
            },
            bufferData
        );
        return encryptedBuffer.toString('base64');
    }
}

export class AlgorithDecrypt {

    constructor(privateKeyString: string) {
        privateKey = crypto.createPrivateKey({
            key: `-----BEGIN PRIVATE KEY-----\n${privateKeyString}\n-----END PRIVATE KEY-----`,
            format: 'pem',
            type: 'pkcs1',
        });
    }

    data(encryptedData: string): string {
        const encryptedBuffer = Buffer.from(encryptedData, 'base64');
        const decryptedBuffer = crypto.privateDecrypt(
            {
                key: privateKey,
                padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                oaepHash: 'sha256',
            },
            encryptedBuffer
        );
        return decryptedBuffer.toString('utf8');
    }
}

