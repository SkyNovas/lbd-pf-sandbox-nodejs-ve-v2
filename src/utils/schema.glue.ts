import { GetSchemaVersionCommand, GlueClient } from '@aws-sdk/client-glue';

export class GlueSchemaService {
    private client: GlueClient;
    private schemaDefinition: string | undefined;

    constructor() {
        this.client = new GlueClient();
    }

    public async getSchemaDefinition(schemaname: string): Promise<string | undefined> {
        if (this.schemaDefinition) {
            return this.schemaDefinition;
        }

        const input = {
            SchemaId: {
                SchemaName: schemaname,
                RegistryName: process.env['VAR_PF_TRANSVERSAL_DS_GLUEREGISTRYNAME'],
            },
            SchemaVersionNumber: {
                LatestVersion: true,
            },
        };
        const response = await this.client.send(new GetSchemaVersionCommand(input));
        this.schemaDefinition = response.SchemaDefinition;
        return this.schemaDefinition;
    }
}
