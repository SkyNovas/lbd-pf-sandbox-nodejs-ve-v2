import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();
export  interface ApiExceptionDetails {
    code: string;
    message: string;
    trackingUuid: string;
    details: any[];
}

enum HttpStatusCode {
    BadRequest = 400,
    Unauthorized = 401,
    NotFound = 404,
    InternalServerError = 500
}

export class ApiException extends Error {
    public code: string;
    public uuid: string;
    public details: string[];

    constructor(code: number, details: string[]) {
        super("ApiException-controlado");
        this.name = "ApiException";
        this.message = this.getStatusMessage(code);
        this.code = `${code}.LBD-PF-SANDBOX-NODEJS-VE.100${code}`;
        this.uuid = uuidv4();
        this.details = details;
        Object.setPrototypeOf(this, ApiException.prototype);
    }

    getStatusMessage(code: number): string {
        switch (code) {
            case HttpStatusCode.BadRequest:
                return "Bad Request";
            case HttpStatusCode.Unauthorized:
                return "Unauthorized";
            case HttpStatusCode.NotFound:
                return "Not Found";
            case HttpStatusCode.InternalServerError:
                return "Internal Server Error";
            default:
                return "Internal Server Error";
        }
    }

    toJSON(): ApiExceptionDetails {
        return {
            code: this.code,
            message: this.message,
            trackingUuid: this.uuid,
            details: this.details
        };
    }
}