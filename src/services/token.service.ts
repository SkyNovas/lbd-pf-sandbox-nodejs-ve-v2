import axios from 'axios';
import { ApiException } from '../exceptions/api.exception';
import * as https from 'https';
import dotenv from 'dotenv';
import { Buffer } from "buffer";

dotenv.config();

const encodedParams = new URLSearchParams();
encodedParams.set('grant_type', 'client_credentials');

const agent = new https.Agent({
    rejectUnauthorized: false
});

function genereteAuthorization() {
    return `Basic  ${Buffer.from(`${process.env.CUSTOMER_KEY}:${process.env.CUSTOMER_SECRET}`, 'binary').toString('base64')}`;
}

export interface ApiTokenResponse {
    access_token: string;
}
export interface ApiSecurity {
    accessId: string;
    publicAccess: string;
    privateAccess: string;
    symmetricCode: string;
    authenticationHashCode: string;
}
export interface ApiSecurityResponse {
    message: string;
    data: ApiSecurity;
}

export const getToken = async (): Promise<ApiTokenResponse> => {
    try {
        const headers = {
            'Authorization': genereteAuthorization(),
            'Content-Type': 'application/x-www-form-urlencoded',
        };
        const respon = await axios.post<ApiTokenResponse>(`${process.env.URI_TOKEN}`, encodedParams.toString(), {
            headers: headers,
            httpsAgent: agent,
        });
        return respon.data;
    } catch (error) {
        throw new ApiException(500, ["Error when trying to consume the authentication resource."]);
    }
}

export const getKeys = async (token: string): Promise<ApiSecurityResponse> => {
    try {
        const headers = {
            'Authorization': `Bearer ${token}`
        };
        const respon = await axios.get<ApiSecurityResponse>(`${process.env.URI_KEY}`,  {
            headers: headers,
            httpsAgent: agent,
        });
        return respon.data;
    } catch (error) {
        throw new ApiException(500, ["Error when trying to consume the security resource."]);
    }
}